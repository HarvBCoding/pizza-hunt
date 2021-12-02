const { Schema, model } = require('mongoose');

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
        default: Date.now
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
        virtuals: true,
    },
    // id is set to false b/c it's a virtual and isn't needed
    id: false
});

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

// create the pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;