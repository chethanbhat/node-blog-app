const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {type: String, required: true, max: 100},
    category: {type: String, default: 'Untitled'},
    imageURL: {type: String},
    post: {type: String, required: true},
    date: {type: Date, default: Date.now}
})

BlogSchema
.virtual('url')
.get(function(){
    return '/blog/' + this._id;
})

BlogSchema
.virtual('pretty_date')
.get(function(){
    return moment(this.date).startOf('hour').fromNow();  ;
})

module.exports = mongoose.model('Blog', BlogSchema);