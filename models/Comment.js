const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReplySchema = new Schema({
  // set custom id to avoid confusion w/ parent comment_id
  replyId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  replyBody: {
    type: String,
    trim: true,
    required: 'You must enter a reply!'
  },
  writtenBy: {
    type: String,
    required: 'You must provide your name!'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => dateFormat(createdAtVal),
  }
},
{
    toJSON: {
        getters: true
    }
});

const CommentSchema = new Schema({
  writtenBy: {
    type: String,
    required: 'You must provide your name!'
  },
  commentBody: {
    type: String,
    required: 'You must enter a comment!'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => dateFormat(createdAtVal)
  },
  // use ReplySchema to validate data for a reply
  replies: [ReplySchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;
