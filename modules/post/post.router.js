const { auth } = require('../../middleware/auth');
const { validate } = require('../../middleware/validation');
const { createPost, editPost, deletePost, getAllPosts, getValidPosts, getUserPosts } = require('./controller/post');
const { reportPost, getReportedPosts, blockPost } = require('./controller/reportPosts');
const { endPoint } = require('./endPoint');
const { createPostValidator, editPostValidator, IDValidator, getPostsValidator } = require('./post.validator');

const router = require('express').Router();

//create post by existing user
router.post('/post', auth(endPoint.createPost), validate(createPostValidator), createPost)
//edit post by post owner
router.put('/post/edit/:id', auth(endPoint.editPost), validate(editPostValidator), editPost)
//delete post by post owner and admin
router.delete('/post/delete/:id', auth(endPoint.deletePost), validate(IDValidator), deletePost)
//user get  profile posts(post owner and admin)
router.get('/post/user/:id', auth(endPoint.getUserPosts), validate(IDValidator), getUserPosts)
//get posts ( User create the post must has activated account and not blocked by the admin or superadmin ) 
router.get('/post/valid', getValidPosts)
//get all posts( admin and super admin)
router.get('/post', auth(endPoint.getAllPosts), validate(getPostsValidator), getAllPosts)

//report posts by user
router.post('/report/post/:id', auth(endPoint.reportPost), validate(IDValidator), reportPost)
//get reported posts
router.get('/report/posts', auth(endPoint.getReportedPosts), validate(getPostsValidator), getReportedPosts)
//block post
router.patch('/block/post/:id', auth(endPoint.blockPosts), validate(IDValidator), blockPost)

module.exports = router