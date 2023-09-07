const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); 
const randomstring = require('randomstring');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    referedBy: {
        type: String,
        required: true,
    },
    referral: {
        type: String,
        unique: true, 
    }
});

userSchema.pre('save', async function (next) {
    if (!this.referral) {
        // Generate a new referral key with a fixed prefix 'E6' and 6 random alphanumeric characters
        const referralKey = `E6${randomstring.generate({
            length: 6,
            charset: 'numeric',
        })}`;

        this.referral = referralKey;
        if (!this.id) {
            this.id = await generateUserId(this.constructor);
        }
    }

    next();
});



async function generateUserId(model) {
    const count = await model.countDocuments({});
    return count + 1;
}

userSchema.plugin(uniqueValidator);
// userSchema.pre('save', async function (next) {
//     if (!this.id) {
//         this.id = await generateUserId(this.constructor);
//     }
//     next();
// });

module.exports = mongoose.model('User', userSchema);
