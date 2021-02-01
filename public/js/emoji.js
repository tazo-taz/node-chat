const emojis =
  "😀😃😄😁😆😅😂🤣😊😇🙂😉😌🤪🤩😍🤑😛😝😜😋😚😙😗😘🤗🤓😎🤠😏😞😒😔😟😩😫😖😣🙁😕🧐🤨😤😠😡🤬😶😐😑😯😦😰😨😱😳🤯😵😲😮😧😢😥🤤😭😓😪😴🙄🤔😷🤧🤢🤮🤐😬🤥🤭🤫🤒🤕😈👿👹👺💩👻💀👽👾🤖🎃🤡😺😸😹😻😼😽🙀😿😾🙌👐🤲👏🙏🤝👍👎👊✊🤛🤜🤞👌👈👉👆👇✋🤚🖖👋🤙💪🖕🤳💅💍💄💋👄👅👂👃👣👀👤👥👶👦🧡💛💚💙💜🖤💔💕💞💓💗💖💘💝💟⚽🏀🏈⚾🎾🏐🏉🎱🏓🏸🥅🏒🏑🏏⛳🏹🎣🥊🥋🎿🏂🏇🍏🍎🍐🍊🍋🍌🍉🍇🍓🍈🍒🍑🍍🥝🥑🍅🍆🥒🥕🌽🥔🍠🌰🍯🥜🥐🍞🥖🧀🥚🍳🥓🥞🍤🍗🍖🍕🌭🍔🍟🥙🌮🌯🥗🥘🍝🍜🍲🍥🍣🍱🍛🍙🍚🍘🍢🍡";
const emojiElement = document.querySelector(".emojis");
const emojiinput = document.querySelector("#emojiinput");
position = 0
for (let k of emojis) {
  let div = document.createElement("div");
  div.classList.add("emoji");
  div.innerText = k;
  div.addEventListener("click", function () {
    document.getElementById("trigger").click()
    emojiinput.value = emojiinput.value.slice(0,position) + k + emojiinput.value.slice(position)
    position += 2
    setCaretPosition(emojiinput, position);
  });
  emojiElement.append(div);
}

document
  .querySelector("#emojibtn")
  .addEventListener("click", () => {
    if(!emojiElement.classList.contains("emojiflex"))position = emojiinput.value.length
    else{
      position = emojiinput.value.slice(0, emojiinput.selectionStart).length
    }
    document.getElementById("trigger").click()
    emojiElement.classList.toggle("emojiflex")
  });

  function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

function setCaretPosition(ctrl, pos)
{
	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}

document.getElementById("trigger").addEventListener("click", function(){
  var result = getInputSelection(emojiinput);
  var resultSpan = document.getElementById("result");
    position = (result.start)
}, false);