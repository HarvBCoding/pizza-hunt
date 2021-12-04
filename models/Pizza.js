const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// create schema using the schema constructor imported from Mongoose & define the fields w/ specific data types
const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // getter to format the value of createdAt with the dateFormat() helper function and used instead of the default timestamp value
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            type: Schema.Types.ObjectId,
            // the ref property tells the Pizza model which documents to search to find the right comments
            ref: 'Comment'
        }
    ]
},
{
    toJSON: {
        // tell Mongoose to use virtuals
        virtuals: true,
        // tell Mongoose to use any getter function specified
        getters: true
    },
    // id is set to false b/c it's a virtual and isn't needed
    id: false
});

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    // the reduce method is used to tally up the total of every comment with its replies
    // reduce takes 2 parameters (an accumulator & a currentValue)
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;