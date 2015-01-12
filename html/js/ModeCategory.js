/********** ModeCategory **********/

function ModeCategory() {}

ModeCategory.prototype.preload = function(resources) {
    var thisMode = this;

    this.SFXShowCategoryScreen = new YDKJAnimation(resources['Category/SFXShowCategoryScreen']);

    this.MusicChooseCategoryStart = new YDKJAnimation(resources['Category/MusicChooseCategoryStart']);
    this.MusicChooseCategoryLoop = new YDKJAnimation(resources['Category/MusicChooseCategoryLoop']);
    this.MusicChooseCategoryStart.volume(70);
    this.MusicChooseCategoryLoop.volume(70);
    this.ShowCategories = new YDKJAnimation(resources['Category/ShowCategories']);

    this.MusicChooseCategoryStart.ended(function(){
        thisMode.MusicChooseCategoryLoop.play();
    });

    this.ChooseCategory = new YDKJAnimation(resources['Category/ChooseCategory']);
    this.ChooseCategoryText = new YDKJAnimation(resources['Category/ChooseCategoryText']);

    this.ChooseCategoryPlayer1 = new YDKJAnimation(resources['Category/ChooseCategoryPlayer1']);
    this.ChooseCategoryPlayer2 = new YDKJAnimation(resources['Category/ChooseCategoryPlayer2']);
    this.ChooseCategoryPlayer3 = new YDKJAnimation(resources['Category/ChooseCategoryPlayer3']);

    this.SFXChoiceCategory = new YDKJAnimation(resources['Category/SFXChoiceCategory']);

    this.LoopCategory1 = new YDKJAnimation(resources['Category/LoopCategory1']);
    this.LoopCategory2 = new YDKJAnimation(resources['Category/LoopCategory2']);
    this.LoopCategory3 = new YDKJAnimation(resources['Category/LoopCategory3']);
    this.ChoiceCategory1 = new YDKJAnimation(resources['Category/ChoiceCategory1']);
    this.ChoiceCategory2 = new YDKJAnimation(resources['Category/ChoiceCategory2']);
    this.ChoiceCategory3 = new YDKJAnimation(resources['Category/ChoiceCategory3']);

    this.questiontitles = resources['questiontitles'];
    this.question1 = resources['question1'];
    this.question2 = resources['question2'];
    this.question3 = resources['question3'];

    if (this.options.chooseplayer) this.chooseplayer = this.options.chooseplayer;
};

ModeCategory.prototype.start = function() {
    var thisMode = this;

    if (!this.chooseplayer) this.chooseplayer = 1; // Déterminer un joueur qui pourra choisir la catégorie
    this.question1.modeObj.chooseplayer = this.chooseplayer;
    this.question2.modeObj.chooseplayer = this.chooseplayer;
    this.question3.modeObj.chooseplayer = this.chooseplayer;

    if (this.chooseplayer == 1) this.ChooseCategoryPlayer = this.ChooseCategoryPlayer1;
    if (this.chooseplayer == 2) this.ChooseCategoryPlayer = this.ChooseCategoryPlayer2;
    if (this.chooseplayer == 3) this.ChooseCategoryPlayer = this.ChooseCategoryPlayer3;

    var listener;
    var chooseCategory = function(chosed) {
        var choice;
        var nextquestion = 0;
        if (chosed == -1) { // Timeout
            // A gérer
        }
        if (chosed) {
            switch (chosed) {
                case 1:
                    choice = thisMode.ChoiceCategory1;
                    nextquestion = thisMode.question1;
                    break;
                case 2:
                    choice = thisMode.ChoiceCategory2;
                    nextquestion = thisMode.question2;
                    break;
                case 3:
                    choice = thisMode.ChoiceCategory3;
                    nextquestion = thisMode.question3;
                    break;
            }
            unbindKeyListener(listener);
            thisMode.game.html.screen.find('.QuestionTitle:not(#QuestionTitle' + (chosed - 1) + ')').remove();
            thisMode.ChooseCategoryPlayer.free();
            thisMode.MusicChooseCategoryLoop.free();
            thisMode.LoopCategory1.free();
            thisMode.LoopCategory2.free();
            thisMode.LoopCategory3.free();

            thisMode.SFXChoiceCategory.ended(function () {
                this.free();
                thisMode.ChooseCategory.free();
                thisMode.ChooseCategoryText.free();
                choice.free();
                nextquestion.start(); // On démarre la question choisie
            });

            thisMode.SFXChoiceCategory.play();
            choice.play();
        }
    };

    this.SFXChoiceCategory.ended(100,function(){
        thisMode.ChooseCategoryPlayer.play();
        thisMode.SFXChoiceCategory.reset(true);
        listener = bindKeyListener(function(choice) {
            var chosed = 0;
            if (choice == 49) chosed = 1;
            else if (choice == 50) chosed = 2;
            else if (choice == 51) chosed = 3;
            chooseCategory(chosed);
        },10000); // 10 secondes de timeout
    });

    this.ChooseCategoryText.ended(function(){
        jQuery('<div />').css({
            'position':'absolute',
            'width':'320px',
            'left':'270px',
            'top':'67px',
            'font-family':'JackRoman',
            'font-size':'32px',
            'color':'#000',
            'text-align':'center',
            'opacity':'0.15'
        }).html(thisMode.game.players[thisMode.chooseplayer-1].name).appendTo(thisMode.game.html.screen);
        jQuery('<div />').css({
            'position':'absolute',
            'width':'320px',
            'left':'288px',
            'top':'85px',
            'font-family':'JackRoman',
            'font-size':'32px',
            'color':'#000',
            'text-align':'center',
            'opacity':'0.40'
        }).html(thisMode.game.players[thisMode.chooseplayer-1].name).appendTo(thisMode.game.html.screen);
        jQuery('<div />').css({
            'position':'absolute',
            'width':'320px',
            'left':'280px',
            'top':'75px',
            'font-family':'JackRoman',
            'font-size':'32px',
            'color':'#FFF',
            'text-align':'center'
        }).html(thisMode.game.players[thisMode.chooseplayer-1].name).appendTo(thisMode.game.html.screen);
    });

    var categoryShown = false;

    this.ShowCategories.ended(300,function(){
        thisMode.SFXChoiceCategory.play();
        thisMode.ChooseCategoryText.play();
        thisMode.LoopCategory1.play();
        thisMode.LoopCategory2.play();
        thisMode.LoopCategory3.play();
        thisMode.LoopCategory1.click(function(){chooseCategory(1)});
        thisMode.LoopCategory2.click(function(){chooseCategory(2)});
        thisMode.LoopCategory3.click(function(){chooseCategory(3)});
        categoryShown = true;
        this.free();
    });

    var ShowCategoryNum = 0;
    this.ShowCategories.setAnimCallback(function(){
        if (ShowCategoryNum < 3) {
            (function(){
                var thisCatNum = ShowCategoryNum;
                var title = thisMode.questiontitles[ShowCategoryNum];
                var div = jQuery('<div />').addClass('QuestionTitle').attr('id','QuestionTitle'+ShowCategoryNum).css({ // Titre de la catégorie
                    'position':'absolute',
                    'width':'0px',
                    'height':'100px',
                    'line-height':'100px',
                    'left':'130px',
                    'top':(163+100*ShowCategoryNum)+'px',
                    'overflow':'hidden'
                }).click(function(){if (categoryShown) chooseCategory(thisCatNum+1)});

                jQuery('<div />').css({
                    'width':'500px',
                    'vertical-align':'middle',
                    'display':'inline-block',
                    'font-size':'32px',
                    'line-height':'32px',
                    'color':'#FC0',
                    'font-family':'JackRoman'
                }).html(title).appendTo(div);

                div.appendTo(thisMode.game.html.screen).animate({'width':'500px'},150);
            })();
            ShowCategoryNum++;
        }
    });

    this.ChooseCategory.ended(300,function(){
        thisMode.ShowCategories.play();
    });

    this.SFXShowCategoryScreen.ended(function(){
        if ((!thisMode.MusicChooseCategoryStart.isplaying) && (!thisMode.MusicChooseCategoryLoop.isplaying)) thisMode.MusicChooseCategoryStart.play();
    });

    this.SFXShowCategoryScreen.play();
    // Jouer l'animation du zoom bleu

    var blueZoom = function() {
        var step=0;
        var sizes=[{x:40,y:30}, // Tailles d'origine du jeu, svp
                   {x:80,y:60},
                   {x:160,y:120},
                   {x:240,y:180},
                   {x:320,y:240},
                   {x:400,y:300},
                   {x:480,y:360},
                   {x:560,y:420},
                   {x:640,y:480}];
        var blueDiv = jQuery('<div />').css('z-index','2000');
        blueDiv.appendTo(thisMode.game.html.screen);
        var interval = 0;
        var nextStep = function() {
            if (step < 9) {
                blueDiv.css({
                    'background-color':'#00C',
                    'width':(sizes[step].x)+'px',
                    'height':(sizes[step].y)+'px',
                    'position':'absolute',
                    'left':Math.round((640-sizes[step].x)/2)+'px',
                    'top':Math.round((480-sizes[step].y)/2)+'px'
                });
                step++;
            } else {
                clearInterval(interval);
                var bluehtml = jQuery('<div />').append(blueDiv.css('z-index','')).html();
                thisMode.game.html.screen.html(bluehtml); // On ne garde que le grand cadre bleu.
                thisMode.ChooseCategory.play();
            }
        };
        interval = setInterval(nextStep,40);
    };

    blueZoom();
    this.MusicChooseCategoryStart.volume(100);
    this.MusicChooseCategoryLoop.volume(100);
};
