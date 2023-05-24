import mongoose from "mongoose";

const schema  = new mongoose.Schema({

    shippingInfo: {
        hNo:{
            type: String,
            required: true
        },

        city:{
            type: String,
            required: true
        },

        state:{
            type: String,
            required: true
        },

        country:{
            type:String,
            required:true
        },

        pinCode:{
            type:Number,
            required:true
        },

        phoneNo:{
            type:Number,
            required:true
        },

    },

    orderItems:{
        cheeseBurger:{
            price:{
                type:Number,
                required:true
            },

            quantity:{
                type:Number,
                required:true
            }
        },

        grilledChickenBurger:{
            price:{
                type:Number,
                required:true
            },

            quantity:{
                type:Number,
                required:true
            }
        },

        jumboBurger:{
            price:{
                type:Number,
                required:true
            },

            quantity:{
                type:Number,
                required:true
            }
        },

    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    paymentMethod:{
        type:String,    
        enum:["COD","Online"],
        default:"COD"
    },

    paymentInfo:{
        type: mongoose.Schema.ObjectId,
        ref:"Payment",
    },

    paidAt: Date,

    itemsPrice:{    
        type:Number,
        default:true
    },
    
    taxPrice:{    
        type:Number,
        default:true
    },

    shippingCharges:{    
        type:Number,
        default:true
    },

    totalAmount:{    
        type:Number,
        default:true
    },
    
    orderStatus:{
        type:String,
        enum:["Preparing","Shipped","Delivered"],
        default:"Preparing"
    },

    deliveredAt: Date,

    createdAt:{
        type:Date,
        default:Date.now
    }
});

export const Order = mongoose.model("Order",schema);