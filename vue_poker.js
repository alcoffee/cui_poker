const marks = ['♠', '♡', '◇', '♣',];
const num_marks = ['J', 'Q', 'K', 'A'];

/**
 * カードを生成
 * 
 * *説明* 引数がないと、ランダム
 *        ジョーカーは存在しないことになっている
 * 
 * @param マークと数値を指定
 * @return カードのマークと数値を返す
 */
function makeCard (mark, num)
{
    let return_string = {mark, num};

    if (mark === undefined && num === undefined) {
        return_string.mark = marks[getRandomInt(marks.length)];
        return_string.num = getRandomInt(13)+2;
    } else {
        return_string = {mark: mark, num: num};
    }

    return return_string;
}

/**
 * デッキからカードを引く
 * 
 * *説明* ランダム
 * 
 * @param array デッキ
 * @param int index
 * @return カードのマークと数値を返す
 */
function drawCard(deck, index)
{
    let random_draw_num = getRandomInt(deck.length);
    let card;

    if (undefined === index) {
        card = deck[random_draw_num];
        deck.splice(random_draw_num, 1);
        return card;
    } else {
        card = deck[index];
        deck.splice(index, 1);
        return card;
    }
}

/**
 * 配列を空にする
 * @param array
 */
function emptyArray(array)
{
    let len = array.length;
    // array.push(0);
    // array.pop(0);
    for (let i=0; i<len; i++) {
        array.pop();
    }
}

/**
 * 手札を評価する
 * *説明*
 * 
 * @param 1-5
 * @return 揃った役の名前を表示
 */
function evaluationHands(hands)
{
    let len = hands.length - 1;
    // 手札が5枚なければ役は出来ない
    if (false === (5 === hands.length)) {
        return "役なし";
    }
    // 重複を判定する
    let d = deduplication(hands);
    
    // ストレートかつフラッシュのと き
    if (1 === d.marks) {
        if (false === (0 === isStraight(hands))) {
            if (14 === sortHands(hands.concat())[len].num) {
                return "ロイヤルストレートフラッシュ";
            } else {
                return "ストレート・フラッシュ";
            }
        }
    }
    // 重複しない数字が２つならフォア・カードかフルハウス
    if (2 === d.nums) {
        if (4 === sameNumCount(hands)) {
            return "フォア・カード"
        } else {
            return "フルハウス"
        }
    }
    // 重複しないマークがひとつならフラッシュ
    if (1 === d.marks) { 
        return "フラッシュ";
    }
    if (false === (0 === isStraight(hands))) {
        return "ストレート";
    }
    // 重複しない数字が３つならスリーカードかツウ・ペア
    if (3 === d.nums) {
        if (3 === sameNumCount(hands)) {
            return "スリー・カード"
        } else {
            return "ツウ・ペア"
        }
    }
    // 重複しない数字が１つならワンペア
    if (4 === d.nums) {
        return "ワンペア";
    }
    return "役なし";
}

/**
 * 手札から数字とマークの重複を排除した個数
 * 
 * @param array hands
 * @return object
 */
function deduplication(hands)
{
    let _nums = [];
    let _marks = [];
    let len = hands.length;
    for (let i=0; i<len; i++) {
        _nums.push(hands[i].num);
        _marks.push(hands[i].mark);
    }
    // 重複を排除
    _nums = Array.from(new Set(_nums));
    _marks = Array.from(new Set(_marks));

    return {marks: _marks.length, nums: _nums.length};
}

/**
 *  ストレートかどうかを判定し、
 *  ストレートであればその強さを返す
 *  
 *  @param array hands
 *  @return int
 */
function isStraight(hands)
{
    let len = hands.length;
    let hands_sorted = sortHands(hands.concat());
    
    for (let i=1; i<len; i++) {
        if (false === (hands_sorted[i-1].num + 1 === hands_sorted[i].num)) {
            // 一つ前のカードよりも一つだけ増えていなければ、ストレートでない
            return 0;
        }
    }
    // 最後まで一つずつ増えていれば、ストレートなので一番高い数字を返す
    return hands_sorted[len-1].num;
}

/** 
 * カードを数字順に
 * 
 * *説明* 単純なソートでlog(n^2)
 * @param array hands
 * @param bool isAsc
 * @return array hands
 */
function sortHands(hands, isAsc)
{
    let len = hands.length;
    let hand_tmp;
    
    if (undefined === isAsc) {
        isAsc = false;
    }

    // 単純なソート 
    for (var i=0; i<len-1; i++) {
        for (var j=i+1; j<len; j++) {
            // 数字を比較
            if (isAsc === (hands[i].num < hands[j].num)) {
                hand_tmp = hands[j];
                hands[j] = hands[i];
                hands[i] = hand_tmp;
            }
            // 数字が同じだったらマークを比較してソート（弱いほど左）
            if (hands[i].num === hands[j].num) {
                if (isAsc === (markPriority(hands[j]) < markPriority(hands[i]))) {
                hand_tmp = hands[j];
                hands[j] = hands[i];
                hands[i] = hand_tmp;
                }
            }
        }
    }
    return hands;
}

/**
 * ストレートかどうかを判定する
 * 
 */
function stringHand(hand)
{
    if (10 < hand.num) {
        return hand.mark+num_marks[hand.num - 11];
    } else {
        return hand.mark+hand.num;
    }
}

/** 
 * カードを文字列で表示
 * 
 * @param array hands
 * @return array
 */
function printHands(hands)
{
    len = hands.length;
    outStr = '';
    for (var i=0; i<len; i++) {
        outStr += stringHand(hands[i])+', ';
    }
    return outStr;
}

/**
 * マークの優先度を返す
 * 
 * @param obj hand
 * @return int
 */
function markPriority(hand) {
    return marks.indexOf(hand.mark);
}

/**
 * 最大の同じ数字が何枚かを数える
 * 
 * *例* スリーカードかフルハウスのときは3を返す
 * @param array hands
 * @return int
 */
function sameNumCount(hands)
{
    let len = hands.length;
    let hands_sorted = sortHands(hands.concat());
    let count_max = 1;
    let count_smaller = 1;

    
    for (var i=1; i<len; i++) {
        if (hands_sorted[i-1].num === hands_sorted[i].num) {
            // 一つ前のカードよりと同じ数字なら数字を増やす
            count_max += 1;
        } else {
            // 別な数字になったとき
            if (count_max > count_smaller ) {
                count_smaller = count_max
            }
            count_max = 1;
        }
    }
    if (count_smaller > count_max) {
        count_max = count_smaller;
    }
    return count_max;
}

/**
 * 山札を初期化する
 * @param array
 */
function initializeDeck(deck)
{
    for (let i=0; i<marks.length; i++) {
        for (let j=2; j<15; j++) {
            deck.push(makeCard(marks[i], j))
        }
    }
}

/**
 * 山札をシャッフルする
 */
function shuffleDeck(deck)
{
    let len = deck.length;
    let card = undefined;
    let rand = undefined;
    for (let i=0; i<len; i++) {
        card = deck[i];
        rand = getRandomInt(len)
        deck.splice(i, 1);
        deck.splice(getRandomInt(len), 0, card);
    }
}

/**
 * ランダムな整数
 * 
 * @param int max 最大値
 * @return 0からmax-1までの整数
 */
function getRandomInt(max)
{
    return Math.floor(Math.random() * max);
}

/**
 * Vueを使って#app-porkerを初期化
 */
window.onload = function () {
    new Vue({
        el: '#app-porker',
        data:
        {
            hands:[
            ],
            deck:[],
            checkedValues: [],
            changeCount: 0,
            cheet: false,
            isAsc: false,
            debug: false,
        },

        created: function()
        {
            // 山札を初期化する
            initializeDeck(this.deck);
            // 山札をシャッフルする
            shuffleDeck(this.deck);

            // 山札の一番上から手札を５枚引く
            this.hands.push(drawCard(this.deck, 0));
            this.hands.push(drawCard(this.deck, 0));
            this.hands.push(drawCard(this.deck, 0));
            this.hands.push(drawCard(this.deck, 0));
            this.hands.push(drawCard(this.deck, 0));
        },

        methods:
        {
            cheetChange: function(value)
            {
                this.cheet = !this.cheet;
            },
            debugChange: function(value)
            {
                this.debug = !this.debug;
            },

            // すべての選択する
            checkall: function()
            {
                if ( 5 === this.checkedValues.length) {
                    for (let i=0; i<5; i++) {
                        this.checkedValues.pop();
                    }
                } else {
                    for (let i=0; i<5; i++) {
                        this.checkedValues.push(i);
                    }
                }
            },

            // 手札を並べ替える
            sort: function()
            {
                let hands_sorted = sortHands(this.hands.concat(), this.isAsc);
                // sortHands(this.hands, this.isAsc);
                // これだとVueの表示が更新されないので$setを使う
                this.isAsc = !this.isAsc;
                for (let i=0; i<this.hands.length; i++) {
                    this.$set(this.hands, i, hands_sorted[i]);
                }
                emptyArray(this.checkedValues);
            },

            // デッキのカードと手札を交換する
            tradeRandom: function()
            {
                let len = this.checkedValues.length;
                if (false === (0 === len)) {
                    this.changeCount += 1;
                }
                for (var i=0; i < len; i++) {
                    let index = this.checkedValues[i];
                    this.$set(this.hands, index, drawCard(this.deck));
                }
                emptyArray(this.checkedValues);
            },

            // デッキの一番上のカードと手札を交換する
            trade: function()
            {
                let check_len = this.checkedValues.length;
                if (false === (0 === check_len)) {
                    this.changeCount += 1;
                }
                for (var i=0; i < check_len; i++) {
                    let index = this.checkedValues[i];
                    this.$set(this.hands, index, drawCard(this.deck, 0));
                }
                emptyArray(this.checkedValues);
            },

            // パス手番だけ増えるだけ
            pass: function()
            {
                this.changeCount += 1;
            },

            // 選択した手札をランダムなカードに作り変える
            remake: function()
            {
                let len = this.checkedValues.length;
                for (var i=0; i < len; i++) {
                    let index = this.checkedValues[i];
                    this.$set(this.hands, index, makeCard());
                }
                emptyArray(this.checkedValues);
                this.changeCount += 1;
            },

            // 山札をシャッフルする
            shuffle: function()
            {
                shuffleDeck(this.deck);
            },


            // ランダムなロイヤルストレートフラッシュ
            rsflash: function()
            {
                let mark = marks[getRandomInt(4)];
                for (let i=0; i<5; i++) {
                    this.hands[i] = makeCard(mark, 10 + i);
                }
                this.changeCount += 1;
                this.$set(this.hands);
            },

            // ランダムなストレートフラッシュ
            sflash: function()
            {
                let mark = marks[getRandomInt(4)];
                let num = getRandomInt(4);
                for (let i=0; i<5; i++) {
                    this.hands[i] = makeCard(mark, num + i);
                }
                this.changeCount += 1;
                this.$set(this.hands);
            },

            // ランダムなストレート
            straight: function()
            {
                let mark;
                let num = getRandomInt(10);
                for (let i=0; i<5; i++) {
                    mark = marks[getRandomInt(4)];
                    this.hands[i] = makeCard(mark, num + i);
                }
                this.changeCount += 1;
                this.$set(this.hands);
            },

            // ランダムなフラッシュ
            flash: function()
            {
                let mark = marks[getRandomInt(4)];
                let num;
                for (let i=0; i<5; i++) {
                    num = getRandomInt(4);
                    this.hands[i] = makeCard(mark, num);
                }
                this.changeCount += 1;
                this.$set(this.hands);
            },

            // 山札の中身を表示する
            showDeck: function()
            {
                let len = this.deck.length;
                let strings = '';
                for (let i=0; i<len; i++) {
                    strings += stringHand(this.deck[i])+ ', ';
                }
                return strings;
            },
        },
    })
};