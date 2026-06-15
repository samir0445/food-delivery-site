import DeliveryAssignment from "../models/delievryAssingment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { sendDelievryOtp } from "../util/nodemailer.js";
import Razorpay from "razorpay";
import "dotenv/config"

// let instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret:process.env.RAZORPAY_SECRET_KEY,
// });

export const placeOrder = async(req,res)=>{
    try {
        const{cartItems,paymentMethod,deliveryAddress ,totalAmount}=req.body;

        if(cartItems.length === 0 || !cartItems){
            return res.status(400).json({  message :"empty cartitem"})
        }
        if(!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude){
             return res.status(400).json({  message :"incomplete delivery address"})
        }
//seperate the item by shops in single order
        const groupItemByShop ={}
        cartItems.forEach(item => {
            const shopId = item.shop;
            if(!groupItemByShop[shopId]){
                groupItemByShop[shopId]=[];//adding only unique shhop
                // this only generate a key with unique shop
            }
            groupItemByShop[shopId].push(item);
        });
        
        // till here the cartitem are get seperated acc to to shop after that we will create a shop order inwhich the the item beling to one order sent to thst shop as small order
        const shopOrders = await Promise.all(Object.keys(groupItemByShop).map(async(shopId)=>{
            const shop = await Shop.findById(shopId).populate("owner");
            if(!shop){
                return res.status(400).json({  message :"shhop not find"})
            }
            const items = groupItemByShop[shopId]
            //it gives total numbers of item that has been order from one shop
            // const subTotal = totalAmount>=500?items.reduce((sum,i)=>sum+Number(i.price)*Number(i.quantity),0):items.reduce((sum,i)=>sum+Number(i.price)*Number(i.quantity),20);
            const subTotal = items.reduce((sum,i)=>sum+Number(i.price)*Number(i.quantity),0);
            return{
                shop:shop._id,
                owner:shop.owner._id,
                subTotal,
                shopOrderItem:items.map((i)=>({
                    item:i.id,
                    price:i.price,
                    quantity:i.quantity,
                    name:i.name
                }))
            }
        })
        
        )
// razorpay backend
        // if(paymentMethod == "online"){
        //     const razorOrder = instance.orders.create({
        //         amount:Math.round(totalAmount*100),
        //         currency:'INR',
        //         receipt:`receipt_${Date.now()}`

        //     })
        //     const newOrder = await Order.create({
        //         user:req.userId,
        //         paymentMethod,
        //         deliveryAddress,
        //         totalAmount,
        //         shopOrders,
        //         razorpayOrderId:razorOrder.id,
        //         payment:false

        //     })
        //     return res.status(200).json({
        //         razorOrder,
        //         orderId:newOrder._id,
        //         key_id: process.env.RAZORPAY_KEY,
        //     })
        // }
        // shoporder create structure shop wise acc to model
        const newOrder = await Order.create({
            user:req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders

        })
       await newOrder.populate("shopOrders.shopOrderItem.item","name image price")
       await newOrder.populate("shopOrders.shop","name")
       await newOrder.populate("shopOrders.owner","name socketId")
       await newOrder.populate("user","name email mobile")

       const io =req.app.get('io');
       if(io){
            newOrder.shopOrders.forEach(shopOrder => {
                const ownerSocketId = shopOrder.owner.socketId;
                if(ownerSocketId){
                    io.to(ownerSocketId).emit('newOrder',{
                    _id:newOrder._id,
                    paymentMethod :newOrder.paymentMethod,
                    user:newOrder.user,
                    shopOrders:shopOrder,
                    createdAt:newOrder.createdAt,
                    deliveryAddress:newOrder.deliveryAddress,
                    })
                }
            });
       }

        return res.status(201).json(newOrder)

        
    } catch (error) {
        return res.status(500).json({ place :"place order" , message :error.message})
    }
}

// export const verifyPayment = async(req,res)=>{
//     try {
//         const {razorpay_payment_id,orderId}=req.body;
//         const payment = await instance.payments.fetch(razorpay_payment_id);
//         if(!payment || payment.status!="captured"){
//             return res.status(400).json({message:"payment didnt captured"})
//         }
//         const order = await Order.findById(orderId);
//         if(!order){
//             return res.status(400).json({message:"payment order didnt found"})
//         }
//         order.payment = true;
//         order.razorpayPaymentId = razorpay_payment_id;
//         await order.save();
//         await order.populate("shopOrders.shopOrderItem.item","name image price")
//        await order.populate("shopOrders.shop","name")
        
//          return res.status(200).json({order ,message:"payment order didnt found"})
        
//     } catch (error) {
//         return res.status(500).json({ place :"verify online" , message :error.message})
//     }
// }

export const getMyOrders = async(req,res)=>{
    try {
        const user = await User.findById(req.userId)

        if(user.role == "user"){
            const orders = await Order.find({user:req.userId})
            .sort({createdAt:-1})
            .populate("shopOrders.shop","name")
            .populate("shopOrders.owner","name email mobile")
            .populate("shopOrders.shopOrderItem.item","name image price")
            
            return res.status(200).json(orders)
        }else if(user.role =="owner"){
            const orders = await Order.find({"shopOrders.owner":req.userId})
            .sort({createdAt:-1})
            .populate("shopOrders.shop","name")
            .populate("user")
            .populate("shopOrders.shopOrderItem.item","name image price")
            .populate("shopOrders.assignedDeliveryBoy","fullName mobile")

            const filterOrder = orders.map(order=>({
                _id:order._id,
                paymentMethod :order.paymentMethod,
                user:order.user,
                shopOrders:order.shopOrders.find(o=>o.owner._id == req.userId),
                createdAt:order.createdAt,
                deliveryAddress:order.deliveryAddress,
            }))

         return res.status(200).json(filterOrder)

        }
        
    } catch (error) {
        return res.status(500).json({ place :"my-order" , message :error.message})
    }
}

export const updateOrderStatus = async(req,res)=>{
    try {
        const{orderId,shopId}=req.params;
        // orderid to find the order 
        // shopid is for to findt he particular shops orderbecause order can contain many shop and orders
        const {status}= req.body;

        const order = await Order.findById(orderId)
        const shopOrder =  order.shopOrders.find(o=>o.shop._id==shopId)
        if(!shopOrder){
             return res.status(400).json({  message :"cannot find shopOrder via shopid"})
        }
        shopOrder.status = status;
        // below is the logic to send notification to all d boy within 10km 5km dist from shop once status became out of delivery

        let deliveryBoyPayload =[];

        if(status =="out_of_delivery" && !shopOrder.assignment){
            //taking lat long of d address
            const {latitude,longitude} = order.deliveryAddress;
            // find all delivery boy user and get their locaton
            const nearByDeliveryBoys = await User.find({
                role:"deliveryBoy",
                location:{
                    $near:{
                        $geometry:{type:"Point" ,coordinates:[Number(longitude),Number(latitude)]},
                        $maxDistance :5500
                    }
                }
            })
            // now we have boys within 5km range
            const nearByIds = nearByDeliveryBoys.map(b=>b._id)
            // find free boy who is not assign
            const busyIds=await DeliveryAssignment.find({
                assignedTo:{$in:nearByIds},
                status:{$nin:["broadcasted","completed"]} 
                //just has assign status becasue complete status also refer boy is free .assign means boy is still delivery
            }).distinct("assignedTo")
// just to remove duplicate 
            const busyIdSet = new Set(busyIds.map(id=>String(id)))
            // filter free boys
            const availableBoys = nearByDeliveryBoys.filter(b=>!busyIdSet.has(String(b._id)))
            
            const candidates =  availableBoys.map(b=>b._id);

            if(candidates.length == 0){
                await order.save();
                return res.status(400).json({message :"order starus updated but not free delievry boy within 5km"})
            }
            // create delivery assignment model
            const deliveryAssignment = await DeliveryAssignment.create({
                order:order._id,
                shop:shopOrder.shop,
                shopOrderId:shopOrder._id,
                broadcastedTo:candidates,
                status:"broadcasted"
            })
            shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;

            // now hance delievry assignment is create give its ref in order model
            shopOrder.assignment = deliveryAssignment._id;
            // creating d boy payload(data) to send
            deliveryBoyPayload=availableBoys.map(b=>({
                id:b._id,
                fullName:b.fullName,
                longitude:b.location.coordinates[0],
                latitude:b.location.coordinates[1],
                mobile:b.mobile     
            }))
            await deliveryAssignment.populate('order')
            await deliveryAssignment.populate('shop')

            const io= req.app.get('io');
            if(io){
                availableBoys.forEach(boy => {
                    const boySocketId = boy.socketId;
                    if(boySocketId){
                        io.to(boySocketId).emit('newAssignment',{
                            sendTo:boy._id,
                            assignmentId:deliveryAssignment._id,
                            orderId:deliveryAssignment.order._id,
                            shopName:deliveryAssignment.shop.name,
                            deliveryAddress:deliveryAssignment.order.deliveryAddress,
                            items:deliveryAssignment.order.shopOrders.find(so=>so._id.equals(deliveryAssignment.shopOrderId)).shopOrderItem||[],
                            subTotal:deliveryAssignment.order.shopOrders.find(so=>so._id.equals(deliveryAssignment.shopOrderId))?.subTotal||0,

                        })
                    }
                });
            }
            


        }



        // await shopOrder.save();
        await order.save();
        const updatedShopOrder = order.shopOrders.find(o=>o.shop==shopId);

        await order.populate("shopOrders.shop","name")
        await order.populate("shopOrders.assignedDeliveryBoy","name mobile email")
        await order.populate("user","socketId")
        const io = req.app.get('io');
        if(io){
            const userSocketId = order.user.socketId
            if(userSocketId){
                io.to(userSocketId).emit('update-status',{
                    orderId:order._id,
                    shopId:updatedShopOrder.shop._id,
                    status:updatedShopOrder.status,
                    userId:order.user._id
                })
            }
        }
        

         return res.status(200).json({
             shopOrder : updatedShopOrder ,
             assignedDeliveryBoy : updatedShopOrder?.assignedDeliveryBoy,
             availableBoys : deliveryBoyPayload,
             assignment:updatedShopOrder?.assignment._id,
         })

    } catch (error) {
         return res.status(500).json({ place :"update order status" , message :error.message})
    }
}


export const getDeliveryBoyAssignment = async(req,res)=>{
    try {
        const deliveryBoyId = req.userId;
        const assignment = await DeliveryAssignment.find({
            broadcastedTo:deliveryBoyId,
            status:"broadcasted"
        })
        .populate("order")
        .populate("shop")

        const formattedData = assignment.map(a=>({
            assignmentId:a._id,
            orderId:a.order._id,
            shopName:a.shop.name,
            deliveryAddress:a.order.deliveryAddress,
            items:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId)).shopOrderItem||[],
            subTotal:a.order.shopOrders.find(so=>so._id.equals(a.shopOrderId))?.subTotal||0,

        }))
        return res.status(200).json(formattedData);
        
    } catch (error) {
        return res.status(500).json({ place :"get assignment" , message :error.message})
    }
}

export const acceptOrder = async(req,res)=>{
    try {
        const{assingmentId}= req.params;
        const assignment = await DeliveryAssignment.findById(assingmentId);
        if(!assingmentId){
            return res.status(400).json({message :"Assignmnet not found"})
        }
        if(assignment.status !== "broadcasted"){
            return res.status(400).json({message :"Assignmnet expire"})
        }
        const alreadyAssigned =await DeliveryAssignment.findOne({
            assignedTo:req.userId,
            status:{$nin:["broadcasted","completed"]} 
        })
        if(alreadyAssigned){
            return res.status(400).json({message :"You have already assign order"})
        }
        assignment.assignedTo=req.userId;
        assignment.status ="assigned";
        assignment.acceptedAt = new Date();
        await assignment.save();

        const order= await Order.findById(assignment.order)
        if(!order){
            return res.status(400).json({message :"Order not found"})
        }
        let shopOrder= order.shopOrders.id(assignment.shopOrderId)
        shopOrder.assignedDeliveryBoy = req.userId;
        await order.save();
        

        return res.status(200).json({
            message:"Order accepted"
        })

        
    } catch (error) {
        return res.status(500).json({ place :"accept assignment" , message :error.message})
    }
}


export const getCurrOrder = async(req,res)=>{
    try {
        const assignment = await DeliveryAssignment.findOne({
            assignedTo:req.userId,
            status:"assigned"
        })
        .populate("shop","name")
        .populate("assignedTo","fullName mobile email location")
        .populate({
            path:"order",
            populate:{path:"user",select:"fullName email location mobile"}
        })

        if(!assignment){
            return res.status(400).json({ message :"assignment not found"})
        }
        if(!assignment.order){
            return res.status(400).json({ message :"assignment order not found"})
        }

        const shopOrder =assignment.order.shopOrders.find(so=>String(so._id)==String(assignment.shopOrderId))
        if(!shopOrder){
            return res.status(400).json({ message :"shop order not found"})
        }

        let deliveryBoyLocation = {lat:null,lon:null};

        if(assignment.assignedTo.location.coordinates.length==2){

            deliveryBoyLocation.lat=assignment.assignedTo.location.coordinates[1];
            deliveryBoyLocation.lon=assignment.assignedTo.location.coordinates[0];
        }


        let customerLocation ={lat:null,lon:null};
        if(assignment.order.deliveryAddress){

            customerLocation.lat= assignment.order.deliveryAddress.latitude;
            customerLocation.lon= assignment.order.deliveryAddress.longitude;
        }

        return res.status(200).json({
            _id:assignment.order._id,
            user:assignment.order.user,
            shopOrder,
            deliveryAddress:assignment.order.deliveryAddress,
            deliveryBoyLocation,
            customerLocation,
        })
    } catch (error) {
        return res.status(500).json({ place :"getCurr assignment" , message :error.message})
    }
}

export const getOrderById = async(req,res)=>{
    try {
        const {orderId} = req.params;
        const order = await Order.findById(orderId)
        .populate("user")
        .populate({
            path:"shopOrders.shop",
            model:"Shop"
        })
        .populate({
            path:"shopOrders.assignedDeliveryBoy",
            model:"User"
        })
        .populate({
            path:"shopOrders.shopOrderItem.item",
            model:"Item"
        })
        .lean()

        if(!order){
             return res.status(400).json({ message :"order not found"})
        }  
        return res.status(200).json(order);
    } catch (error) {
         return res.status(500).json({ place :"getby id assignment" , message :error.message})
    }
}

export const sendDeliveryOtp = async(req,res)=>{
    try {
        const {orderId,shopOrderId}= req.body;
        let order = await Order.findById(orderId).populate("user")
        let shopOrder = order.shopOrders.id(shopOrderId)
        if(!order || !shopOrder){
            return res.status(400).json({message:" order or shopOrder not found"});
        }
        const otp = Math.floor(1000 + Math.random() *9000).toString();
        shopOrder.deliveryOtp = otp;
        shopOrder.otpExpires = Date.now() + 10*60*1000;
        await order.save();
        // await sendDelievryOtp(order.user,otp);
        return res.status(200).json({message:"delivery otp send successfully"}); 
    } catch (error) {
        return res.status(500).json({ place :"sending delivery otp" , message :error.message})
    }

}

export const verifyDeliveryOtp = async(req,res)=>{
    try {
        const {orderId,shopOrderId,otp} = req.body;
        let order = await Order.findById(orderId);
        let shopOrder = order.shopOrders.id(shopOrderId)
        if(!order || !shopOrder){
            return res.status(400).json({message:" order or shopOrder not found"});
        }
        if(shopOrder.deliveryOtp != otp|| shopOrder.otpExpires<Date.now()){
            return res.status(400).json({message:"delivery otp recheck "});
        }
        shopOrder.status = "delivered";
        shopOrder.deliveredAt = Date.now();
        await order.save();
        
        await DeliveryAssignment.deleteOne({
            shopOrderId:shopOrder._id,
            order:order._id,
            assignedTo:shopOrder.assignedDeliveryBoy
        })
        return res.status(200).json({message:"Order Delivered successFully"});
        
    } catch (error) {
        return res.status(500).json({ place :"sending delivery otp" , message :error.message})
    }
}

export const getTodayDelivery = async(req,res)=>{
    try {
        const deliveryBoyId = req.userId;
        const startOfDay =new Date();
        startOfDay.setHours(0,0,0,0);

        const orders = await Order.find({
            "shopOrders.assignedDeliveryBoy":deliveryBoyId,
            "shopOrders.status":"delivered",
            "shopOrders.deliveredAt":{$gte:startOfDay}
        }).lean()
        let todayDeliveries =[];
        orders.forEach(order=>{
            order.shopOrders.forEach(shopOrder=>{
                if(shopOrder.assignedDeliveryBoy == deliveryBoyId && shopOrder.status == "delivered" && shopOrder.deliveredAt && shopOrder.deliveredAt >= startOfDay){
                    todayDeliveries.push(shopOrder)
                }
            })
        })

        let stats ={}
        todayDeliveries.forEach(shopOrder=>{
            const hour = new Date(shopOrder.deliveredAt).getHours();
            stats[hour]=(stats[hour]||0)+1;
            
        })
        let formattedStats = Object.keys(stats).map(hour=>({
            hour:parseInt(hour),
            count:stats[hour]
        }))
        formattedStats.sort((a,b)=>a.hour-b.hour)
        
        return res.status(200).json(formattedStats);

    } catch (error) {
        return res.status(500).json({ place :"get today delivery" , message :error.message})
    }
}