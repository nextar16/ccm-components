ccm.component({name:"comments",config:{html:[ccm.store,{local:"json/template.json"}],key:"mk_comment",store:[ccm.store,{url:"ws://ccm2.inf.h-brs.de/index.js",store:"mk_comments_1_0_0"}],style:[ccm.load,"css/comments.css"],user:[ccm.instance,"https://kaul.inf.h-brs.de/ccm/components/user2.js"],likes:[ccm.component,"https://nextar16.github.io/ccm-components/resources/likes/ccm.likes.js"]},Instance:function(){var e=this;e.init=function(t){e.store.onChange=function(){e.render()},t()},e.render=function(t){var n=ccm.helper.element(e);e.store.get(e.key,function(c){function m(){return Math.floor(2147483647*Math.random()+1)}function r(c){n.html(ccm.helper.html(e.html.get("main")));for(var r=ccm.helper.find(e,".comments"),s=0;s<c.comments.length;s++){var o=c.comments[s];r.append(ccm.helper.html(e.html.get("comment"),{id:ccm.helper.val(o.id),name:ccm.helper.val(o.user),date:ccm.helper.val(o.date),text:ccm.helper.val(o.text)})),e.likes.render({element:jQuery("#"+o.id),parent:e})}r.append(ccm.helper.html(e.html.get("input"),{onsubmit:function(){var t=ccm.helper.val(ccm.helper.find(e,"input").val()).trim(),n=new Date;if(""!==t)return e.user.login(function(){c.comments.push({id:m(),user:e.user.data().key,text:t,date:n.getDate()+"."+(n.getMonth()+1)+"."+n.getFullYear()}),e.store.set(c,function(){e.render()})}),!1}})),t&&t()}null===c?e.store.set({key:e.key,comments:[]},r):r(c)})}}});