$(function() {
    $('.js_comment').click(function(e) {
        var $this = $(this)
        $(".js_comment_textarea").focus()
        var toId = $this.data('tid') // 给谁回复
        var commentId = $this.data('cid') // 要回复评论的id

        if ($("#js_insert_toId").length > 0) {
            $("#js_insert_toId").value(toId)
        } else {
            $('<input>').attr({
                type: "hidden",
                name: "comment[tid]",
                id: "js_insert_toId",
                value: toId
            }).appendTo('#commentForm')
        }
        
        if ($("#js_insert_commentId").length > 0) {
            $("#js_insert_commentId").value(commentId)
        } else {
            $('<input>').attr({
                type: "hidden",
                name: "comment[cid]",
                id: "js_insert_commentId",
                value: commentId
            }).appendTo('#commentForm')
        }
    })
})