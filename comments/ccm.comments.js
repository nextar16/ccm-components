ccm.component( {

    name: 'comments',

    config: {

        html:  [ ccm.store, { local: '../comments/template.json' } ],
        key:   'mk_comment',
        store: [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'mk_comments_1_0_0' } ],
        style: [ ccm.load, '../comments/comments.css' ],
        user:  [ ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user2.js' ],
        likes: [ ccm.component, '../likes/ccm.likes.js' ]
    },

    Instance: function () {
        var self = this;

        self.init = function (callback ){
            self.store.onChange = function () {
                self.render();
            };

            callback();
        };

        self.render = function (callback) {
            var element = ccm.helper.element(self);

            self.store.get(self.key, function (dataset) {
                if (dataset === null) {
                    self.store.set({key: self.key, comments: []}, proceed );
                } else {
                    proceed(dataset);
                }

                function generateid() {
                    return Math.floor((Math.random() * 2147483647) + 1);
                }

                function proceed(dataset) {
                    // get main element
                    element.html( ccm.helper.html(self.html.get( 'main' )));

                    // find comments div
                    var comments_div = ccm.helper.find(self, '.comments');
                    
                    // insert comments into comment div
                    for ( var i = 0; i < dataset.comments.length; i++ ) {
                        var comment = dataset.comments[i];
                        
                        // render html for comment
                        comments_div.append(
                            ccm.helper.html(
                                // element
                                self.html.get('comment'),
                                // data
                                {
                                    id: ccm.helper.val( comment.id),
                                    name: ccm.helper.val( comment.user ),
                                    date: ccm.helper.val( comment.date ),
                                    text: ccm.helper.val( comment.text )
                                }
                            )
                        );

                        // render like component for comment
                        self.likes.render({element: jQuery( '#' + comment.id ), parent: self});
                    }

                    // add on submit function
                    comments_div.append(
                        ccm.helper.html(
                            self.html.get('input'),
                            {
                                onsubmit: function () {
                                    var value = ccm.helper.val( ccm.helper.find( self, 'input' ).val() ).trim();
                                    var date = new Date();

                                    if ( value === '' ) {
                                        return;
                                    }

                                    self.user.login( function () {
                                        dataset.comments.push({
                                            id: generateid(),
                                            user: self.user.data().key,
                                            text: value,
                                            date: date.getDate() +"."+ (date.getMonth()+1) +"."+ date.getFullYear()
                                        });
                                        self.store.set( dataset, function () { self.render(); } );
                                    } );

                                    return false;
                                }
                            }
                        )
                    );

                    // end of render
                    if ( callback ) callback();
                }
            });
        };
    }
} );