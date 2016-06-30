ccm.component( {

    name: 'likes',

    config: {
        store: [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'mk_likes_1_0_0' } ],
        user:  [ ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user2.js' ]
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
            var id = element.parent().attr("id");

            self.store.get(id, function (dataset) {
                if (dataset === null) {
                    self.store.set({key: id, likes: []}, proceed );
                } else {
                    proceed(dataset);
                }

                function proceed(dataset) {
                    element.html("");

                    rawLikes = (dataset.likes.length === null) ? 0 : dataset.likes.length;
                    likes = "<span>"+rawLikes+"</span>";

                    btn = $('<input />', {
                        type: 'button',
                        value: 'I Love It!',
                        on: {
                            click: function() {
                                self.user.login( function () {
                                    if ((index = dataset.likes.indexOf(self.user.data().key)) > -1) {
                                        dataset.likes.splice(index, 1)
                                        console.log(dataset.likes, index)
                                        self.store.set(dataset, function () {
                                            self.render();
                                        })
                                    } else {
                                        dataset.likes.push(
                                            self.user.data().key
                                        );
                                    }

                                    self.store.set( dataset, function () { self.render(); } );
                                } );

                                return false;
                            }
                        }
                    });

                    if (self.user.isLoggedIn()) {
                        if (dataset.likes.indexOf(self.user.data().key) > -1) {
                            btn.attr('value', "I Don't Love");
                        }
                    }

                    element.append(likes);
                    element.append(btn);

                    if ( callback ) callback();
                }
            });
        };
    }
} );