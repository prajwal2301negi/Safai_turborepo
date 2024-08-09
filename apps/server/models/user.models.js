import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, "Name must contain atleast 3 characters"],
        maxLength: [30, "Name must contain maximum 30 characters"],
        validate: [validator.isAlphanumeric, "Please enter characters only"],
        trim: true,

    },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female", "Other"],
            message: "Please select gender",
        },
        validate: [validator.isAlpha, "Enter valid entity"],
    },
    phone: {
        type: String,
        minLength: [10, "Phone Number must be 10 digit"],
        validate: [validator.isMobilePhone, "Enter a valid phone Number"],
        validator: ((value) => {
            return value.minLength = 10;
        }),
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Enter a valide email"],
        unique: true,
    },
    address: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        minLength: [8, "Password is too short"],
        required: [true, "Please enter password"],
        // select: false,
        validate: [validator.isStrongPassword, "Enter a strong Password"],
    },
    token: {
        type: String,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    document: {
        type: String,
        enum: ["License", "AadharCard", "PanCard", "VoterId"],
    },
    docAvatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        enum: {
            values: ["User", "Admin"],
            message: "Please select role",
        },
        required: true,
        validate: [validator.isAlpha, "Enter a valid entity"],
    },
    occupation: {
        type: String,
        enum: [
            "Barber",
            "Plumber",
            "Electrician",
            "Helper",
            "BabySitter",
            "House Work",
            "Driver",
            "Mechanic",
            "MobileRepairing",
            "Carpenter",
            "SalesMan",
            "Others",
        ],
    },
    salary: {
        type: String,
        trim: true,
    },
    available: {
        type: String,
        enum: {
            values: ["Available", "NotAvailable"],
            message: ["Enter correct entity"],
        },
    },
    desc: {
        type: String,
        trim: true,
    },

},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);


userSchema.post('save', function (doc, next) {
    const content = `A new puser with name:${doc.name} has been created by ${doc.createdBy}\n`;
    fs.writeFileSync('../log.txt', content, { flag: 'a' }, (err) => {
        console.log(err.message);
    })
    next();
})

userSchema.virtual('roleOfTheCustomer').get(function () {
    return this.role;
})

const user = mongoose.model("User", userSchema);
export default user;