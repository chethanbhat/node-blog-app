const Blog = require('../models/blog');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');


// Display list of all Blog Posts.
exports.blog_list = function(req, res, next) {
    Blog.find({})
        .sort({date: 'desc'})   
        .exec(function(err, blog_list){
            if(err){return next(err);}
            // Successful, so render. 
            res.render('blog_list',{title: 'Blog', blog_list})
        })
};

// Display detail page for a specific Blog Post.
exports.blog_detail = function(req, res, next) {
    Blog.findById(req.params.id, (err, blog) => {
        if(err){ return next(err);}
        if(blog == null){
            let err = new Error('Post not found');
            err.status = 404;
            return next(err);
        }
        // Successful
        res.render('blog_detail',{title: blog.title, blog } )
    });
};

// Display Blog Post create form on GET.
exports.blog_create_get = function(req, res) {
    res.render('blog_form', {title: 'Create Post'});
};

// Handle Blog Post create on POST.
exports.blog_create_post = [
    // Validate fields
    body('title', 'Post Title Required').isLength({min: 1}).trim(),
    body('category').trim(),
    body('imageURL').trim(),
    body('post', 'Post Content Required').isLength({min: 1}).trim(),

    // Sanitize (trim and excape) fields
    sanitizeBody('title').trim().escape(),
    sanitizeBody('category').trim().escape(),
    sanitizeBody('post').trim().escape(),

    (req, res, next) => {
            // Extract the validation errors from a request.
            const errors = validationResult(req);

             // Create a genre object with escaped and trimmed data.
            const blog = new Blog(
                { 
                    title: req.body.title,
                    category: req.body.category,
                    imageURL: req.body.imageURL,
                    post: req.body.post
                }
            );

            if (!errors.isEmpty()) {
                // There are errors. Render the form again with sanitized values/error messages.
                res.render('blog_form', { title: 'Create Post', blog: blog, errors: errors.array()});
            return;
            }
            else {
                blog.save(function(err){
                    if(err){ return next(err);}
                    res.redirect(blog.url);
                });
            }
    }
];

// Display Blog delete form on GET.
exports.blog_delete_get = function(req, res, next) {
    Blog.findById(req.params.id, function(err, blog){
        if (err) { return next(err); }
        if (blog==null) { // No results.
            res.redirect('/blog');
        }
        // Successful, so render.
        res.render('blog_delete', { title: 'Delete Blog Post', blog } );
    });
};

// Handle Blog Post delete on POST.
exports.blog_delete_post = function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err, blog){
        if (err) { return next(err); }
        // Successful, go to Blog list.
        res.redirect('/blog');
    })
};

// Display Blog Post update form on GET.
exports.blog_update_get = function(req, res) {
    Blog.findById(req.params.id, function(err, blog){
        res.render('blog_form', {title: 'Update Post', blog});
    })
};

// Handle Blog Post update on POST.
exports.blog_update_post = [
    // Validate fields
    body('title', 'Post Title Required').isLength({min: 1}).trim(),
    body('category').trim(),
    body('imageURL').trim(),
    body('post', 'Post Content Required').isLength({min: 1}).trim(),

    // Sanitize (trim and excape) fields
    sanitizeBody('title').trim().escape(),
    sanitizeBody('category').trim().escape(),
    sanitizeBody('post').trim().escape(),

    (req, res, next) => {
            // Extract the validation errors from a request.
            const errors = validationResult(req);

             // Create a genre object with escaped and trimmed data.
            const blog = new Blog(
                { 
                    title: req.body.title,
                    category: req.body.category,
                    imageURL: req.body.imageURL,
                    post: req.body.post,
                    _id: req.params.id
                }
            );

            if (!errors.isEmpty()) {
                // There are errors. Render the form again with sanitized values/error messages.
                res.render('blog_form', { title: 'Create Post', blog: blog, errors: errors.array()});
            return;
            }
            else {
                Blog.findByIdAndUpdate(req.params.id, blog, {}, function(err, blog){
                    if(err){ return next(err);}
                    res.redirect(blog.url);
                });
            }
    }
];