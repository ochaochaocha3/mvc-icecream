var
  // モデル：アイスクリーム一覧
  icecreamModel = {
    list: [
      {
        id: 't1',
        name: 'バニラ'
      },
      {
        id: 't2',
        name: 'チョコレートチップ'
      },
      {
        id: 't3',
        name: 'オレンジシャーベット'
      },
      {
        id: 't4',
        name: 'チョコミント'
      },
      {
        id: 't5',
        name: 'ストロベリー'
      },
      {
        id: 't6',
        name: '抹茶'
      }
    ],

    // すべてのアイスクリームを返す（getter）
    getAll: function getAll() {
      return this.list;
    },

    // ID で指定したアイスクリームオブジェクトを返す
    findById: function findById(id) {
      return this.list.filter(function (icecream) {
        return icecream.id === id;
      })[0];
    }
  },

  // モデル：選択されているアイスクリームの管理
  selectionModel = {
    // 選択されているアイスクリーム
    list: [],

    // アイスクリームの個数
    icecreamNumber: 2,

    // 選択されているアイスクリームを返す（getter）
    getIcecreams: function getIcecreams() {
      return this.list;
    },

    // アイスクリームを追加する
    add: function add(item) {
      var list = this.list;

      list.push(item);

      if (list.length > this.icecreamNumber) {
        // アイスクリームが制限個数以上の場合は最初のものを捨てる
        list.shift();
      }

      this.updateView();
    },

    // アイスクリームをクリアする
    clear: function clear() {
      this.list = [];
      this.updateView();
    },

    // アイスクリームが選択されていなければ true が返る
    isEmpty: function isEmpty() {
      return this.getIcecreams().length < 1;
    },

    // 指定したアイスクリームが選択されていれば true が返る
    contain: function contain(icecream) {
      return this.getIcecreams().indexOf(icecream) >= 0;
    },

    // ID で指定したアイスクリームが選択されていれば true が返る
    containById: function containById(id) {
      return this.contain(icecreamModel.findById(id));
    },

    // ビューを更新する
    updateView: function updateView() {
      updateSelection();
      updateIcecreamList();
      updateClearability();
    }
  },

  $checkboxes = [],
  $icecreamList = $('#icecream-list'),
  $clear = $('#clear');

// 簡単なテストチェック関数
function ok(title, value, expect) {
  if (expect === value) {
    console.log('OK: ' + title);
  } else {
    console.log('NG: '+ title + ' <' + value + '> !== <' + expect + '>');
  }
}

function testModels() {
  var
    all = icecreamModel.getAll(),
    t1 = all[0],
    t2 = all[1],
    t3 = all[2],
    t4 = all[3];

  ok('icecreamModel: 個数', all.length, 6);
  ok('icecreamModel.findById', icecreamModel.findById('t4'), t4);

  ok(
    'selectionModel: 最初の個数',
    selectionModel.getIcecreams().length,
    0
  );
  ok(
    'selectionModel.contain: 空の場合',
    selectionModel.contain(t1),
    false
  );

  selectionModel.add(t1);
  ok(
    'selectionModel: 1 つ目を追加したときの個数',
    selectionModel.getIcecreams().length,
    1
  );
  ok(
    'selectionModel.contain: 1 つ目',
    selectionModel.contain(t1),
    true
  );

  selectionModel.add(t2);
  ok(
    'selectionModel: 2 つ目を追加したときの個数',
    selectionModel.getIcecreams().length,
    2
  );
  ok(
    'selectionModel.contain: 1 つ目',
    selectionModel.contain(t1),
    true
  );
  ok(
    'selectionModel.contain: 2 つ目',
    selectionModel.contain(t2),
    true
  );

  selectionModel.add(t3);
  ok(
    'selectionModel: 3 つ目を追加したときの個数',
    selectionModel.getIcecreams().length,
    2
  );
  ok(
    'selectionModel.contain: 2 つ目',
    selectionModel.contain(t2),
    true
  );
  ok(
    'selectionModel.contain: 3 つ目',
    selectionModel.contain(t3),
    true
  );
  ok(
    'selectionModel.contain: 1 つ目が消える',
    selectionModel.contain(t1),
    false
  );
}

//testModels();

// コントローラ：GUI のイベントからモデルの更新に変換
function onclickIcecream(event) {
  var checkbox = $(event.currentTarget).
    find('input[type="checkbox"]');

  if (checkbox) {
    selectionModel.add(
      icecreamModel.findById(checkbox.prop('name'))
    );
  }
}

// コントローラ：クリアボタンクリック時にモデルのクリアを行う
function onclickClear() {
  selectionModel.clear();
}

// アイスクリーム一覧を構築する
$(function () {
  var $icecreams = $('#icecreams');

  icecreamModel.getAll().forEach(function (icecream) {
    var
      $name = $('<label>').
        text(icecream.name).
        prop('for', icecream.id),
      $checkbox = $('<input type="checkbox">').
        prop('id', icecream.id).
        prop('name', icecream.id),
      $li = $('<li>').
        append($checkbox).
        append(' ').
        append($name).
        change(onclickIcecream);

    $icecreams.append($li);
  });

  $checkboxes = $('#icecreams input[type="checkbox"]');

  $clear.click(onclickClear);

  selectionModel.clear();
});

// ビュー：チェックボックスを更新する
function updateSelection() {
  $checkboxes.each(function (i, element) {
    element.checked = selectionModel.containById(element.name);
  });
}

// ビュー：選択順序を更新する
function updateIcecreamList() {
  var
    icecreams = selectionModel.getIcecreams(),
    text = icecreams.map(function (icecream) {
      return icecream.name;
    }).join(' > ');

  $icecreamList.text(text === '' ? '（なし）' : text);
}

// ビュー：クリアできるかどうかを更新する
function updateClearability() {
  $clear.prop('disabled', selectionModel.isEmpty());
}
