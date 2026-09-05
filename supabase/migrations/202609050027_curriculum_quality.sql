-- Generated from curriculum/*.json by scripts/generate-curriculum-quality-migration.mjs.
-- 025 remains immutable. This release updates editorial fields only, preserving
-- IDs, level placement, Teacher controls, plan access, progress and favourites.
-- Replay accepts the exact after-state. Any intervening Teacher content edits
-- fail closed with item IDs, before a single update is committed.
begin;

lock table public.review_curriculum_items, public.review_curriculum_levels in share row exclusive mode;

create temporary table review_release_027_items on commit drop as
select * from jsonb_to_recordset($curriculum_quality$[
  {
    "id": "word-l01-book",
    "category": "words",
    "level": 1,
    "before_fields": {
      "title_en": "book",
      "title_ja": "本",
      "content": {
        "word": "book",
        "japanese": "本",
        "kanaReading": "ブック",
        "pronunciationHint": "Use the short /ʊ/ sound, not a long “oo.”",
        "exampleSentence": "This book is new.",
        "exampleJapanese": "この本は新しいです。",
        "commonMistake": "Do not stretch the vowel as in “moon.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "classroom"
      },
      "icon": "📘",
      "tags": [
        "classroom",
        "level-1",
        "book"
      ]
    },
    "after_fields": {
      "title_en": "book",
      "title_ja": "本",
      "content": {
        "word": "book",
        "japanese": "本",
        "kanaReading": "ブック",
        "pronunciationHint": "Use the short /ʊ/ sound, not a long “oo.”",
        "exampleSentence": "This is my book.",
        "exampleJapanese": "これは私の本です。",
        "commonMistake": "Do not stretch the vowel as in “moon.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5366699714252a09.svg",
          "kind": "single",
          "altEn": "An illustration of book.",
          "altJa": "本のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "classroom"
      },
      "icon": "",
      "tags": [
        "classroom",
        "level-1",
        "book"
      ]
    }
  },
  {
    "id": "word-l01-pen",
    "category": "words",
    "level": 1,
    "before_fields": {
      "title_en": "pen",
      "title_ja": "ペン",
      "content": {
        "word": "pen",
        "japanese": "ペン",
        "kanaReading": "ペン",
        "pronunciationHint": "Finish with a clear /n/ sound.",
        "exampleSentence": "May I use your pen?",
        "exampleJapanese": "あなたのペンを使ってもいいですか。",
        "commonMistake": "Do not add an extra vowel after the final n.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "classroom"
      },
      "icon": "🖊️",
      "tags": [
        "classroom",
        "level-1",
        "pen"
      ]
    },
    "after_fields": {
      "title_en": "pen",
      "title_ja": "ペン",
      "content": {
        "word": "pen",
        "japanese": "ペン",
        "kanaReading": "ペン",
        "pronunciationHint": "Finish with a clear /n/ sound.",
        "exampleSentence": "I have a pen.",
        "exampleJapanese": "私はペンを持っています。",
        "commonMistake": "Do not add an extra vowel after the final n.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-94a5f3160646668c.svg",
          "kind": "single",
          "altEn": "An illustration of pen.",
          "altJa": "ペンのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "classroom"
      },
      "icon": "",
      "tags": [
        "classroom",
        "level-1",
        "pen"
      ]
    }
  },
  {
    "id": "word-l01-desk",
    "category": "words",
    "level": 1,
    "before_fields": {
      "title_en": "desk",
      "title_ja": "机",
      "content": {
        "word": "desk",
        "japanese": "机",
        "kanaReading": "デスク",
        "pronunciationHint": "Join /s/ and /k/ at the end without a vowel.",
        "exampleSentence": "My desk is by the window.",
        "exampleJapanese": "私の机は窓のそばです。",
        "commonMistake": "Avoid saying “desuku” with extra vowels.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "classroom"
      },
      "icon": "🪑",
      "tags": [
        "classroom",
        "level-1",
        "desk"
      ]
    },
    "after_fields": {
      "title_en": "desk",
      "title_ja": "机",
      "content": {
        "word": "desk",
        "japanese": "机",
        "kanaReading": "デスク",
        "pronunciationHint": "Join /s/ and /k/ at the end without a vowel.",
        "exampleSentence": "This is my desk.",
        "exampleJapanese": "これは私の机です。",
        "commonMistake": "Avoid saying “desuku” with extra vowels.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5d8892262355b0b1.svg",
          "kind": "single",
          "altEn": "An illustration of desk.",
          "altJa": "机のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "classroom"
      },
      "icon": "",
      "tags": [
        "classroom",
        "level-1",
        "desk"
      ]
    }
  },
  {
    "id": "word-l01-chair",
    "category": "words",
    "level": 1,
    "before_fields": {
      "title_en": "chair",
      "title_ja": "椅子",
      "content": {
        "word": "chair",
        "japanese": "椅子",
        "kanaReading": "チェア",
        "pronunciationHint": "Start with the /tʃ/ sound in “cheese.”",
        "exampleSentence": "Please sit on this chair.",
        "exampleJapanese": "この椅子に座ってください。",
        "commonMistake": "Do not pronounce the first sound like /ʃ/.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "classroom"
      },
      "icon": "💺",
      "tags": [
        "classroom",
        "level-1",
        "chair"
      ]
    },
    "after_fields": {
      "title_en": "chair",
      "title_ja": "椅子",
      "content": {
        "word": "chair",
        "japanese": "椅子",
        "kanaReading": "チェア",
        "pronunciationHint": "Start with the /tʃ/ sound in “cheese.”",
        "exampleSentence": "Sit on the chair, please.",
        "exampleJapanese": "椅子に座ってください。",
        "commonMistake": "Do not pronounce the first sound like /ʃ/.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-44095b5fcb8554e1.svg",
          "kind": "single",
          "altEn": "An illustration of chair.",
          "altJa": "椅子のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "classroom"
      },
      "icon": "",
      "tags": [
        "classroom",
        "level-1",
        "chair"
      ]
    }
  },
  {
    "id": "word-l01-bag",
    "category": "words",
    "level": 1,
    "before_fields": {
      "title_en": "bag",
      "title_ja": "かばん",
      "content": {
        "word": "bag",
        "japanese": "かばん",
        "kanaReading": "バッグ",
        "pronunciationHint": "Use a short, open /æ/ vowel.",
        "exampleSentence": "My bag is under the desk.",
        "exampleJapanese": "私のかばんは机の下です。",
        "commonMistake": "Do not make the vowel sound like the one in “bug.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "classroom"
      },
      "icon": "🎒",
      "tags": [
        "classroom",
        "level-1",
        "bag"
      ]
    },
    "after_fields": {
      "title_en": "bag",
      "title_ja": "かばん",
      "content": {
        "word": "bag",
        "japanese": "かばん",
        "kanaReading": "バッグ",
        "pronunciationHint": "Use a short, open /æ/ vowel.",
        "exampleSentence": "This is my bag.",
        "exampleJapanese": "これは私のかばんです。",
        "commonMistake": "Do not make the vowel sound like the one in “bug.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b98eb2264146b273.svg",
          "kind": "single",
          "altEn": "An illustration of bag.",
          "altJa": "かばんのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "classroom"
      },
      "icon": "",
      "tags": [
        "classroom",
        "level-1",
        "bag"
      ]
    }
  },
  {
    "id": "word-l01-door",
    "category": "words",
    "level": 1,
    "before_fields": {
      "title_en": "door",
      "title_ja": "ドア",
      "content": {
        "word": "door",
        "japanese": "ドア",
        "kanaReading": "ドア",
        "pronunciationHint": "Hold the vowel smoothly and finish with a light r in US English.",
        "exampleSentence": "Please close the door.",
        "exampleJapanese": "ドアを閉めてください。",
        "commonMistake": "Do not split it into two strong syllables.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "classroom"
      },
      "icon": "🚪",
      "tags": [
        "classroom",
        "level-1",
        "door"
      ]
    },
    "after_fields": {
      "title_en": "door",
      "title_ja": "ドア",
      "content": {
        "word": "door",
        "japanese": "ドア",
        "kanaReading": "ドア",
        "pronunciationHint": "Hold the vowel smoothly and finish with a light r in US English.",
        "exampleSentence": "Please close the door.",
        "exampleJapanese": "ドアを閉めてください。",
        "commonMistake": "Do not split it into two strong syllables.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ec2d10a015e2e0ef.svg",
          "kind": "single",
          "altEn": "An illustration of door.",
          "altJa": "ドアのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "classroom"
      },
      "icon": "",
      "tags": [
        "classroom",
        "level-1",
        "door"
      ]
    }
  },
  {
    "id": "word-l01-window",
    "category": "words",
    "level": 1,
    "before_fields": {
      "title_en": "window",
      "title_ja": "窓",
      "content": {
        "word": "window",
        "japanese": "窓",
        "kanaReading": "ウィンドウ",
        "pronunciationHint": "Stress the first syllable: WIN-dow.",
        "exampleSentence": "Open the window, please.",
        "exampleJapanese": "窓を開けてください。",
        "commonMistake": "Do not stress the final syllable.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "classroom"
      },
      "icon": "🪟",
      "tags": [
        "classroom",
        "level-1",
        "window"
      ]
    },
    "after_fields": {
      "title_en": "window",
      "title_ja": "窓",
      "content": {
        "word": "window",
        "japanese": "窓",
        "kanaReading": "ウィンドウ",
        "pronunciationHint": "Stress the first syllable: WIN-dow.",
        "exampleSentence": "Open the window, please.",
        "exampleJapanese": "窓を開けてください。",
        "commonMistake": "Do not stress the final syllable.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f196ef206aba0963.svg",
          "kind": "single",
          "altEn": "An illustration of window.",
          "altJa": "窓のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "classroom"
      },
      "icon": "",
      "tags": [
        "classroom",
        "level-1",
        "window"
      ]
    }
  },
  {
    "id": "word-l01-teacher",
    "category": "words",
    "level": 1,
    "before_fields": {
      "title_en": "teacher",
      "title_ja": "先生",
      "content": {
        "word": "teacher",
        "japanese": "先生",
        "kanaReading": "ティーチャー",
        "pronunciationHint": "Stress TEE and use /tʃ/ in the middle.",
        "exampleSentence": "Our teacher is kind.",
        "exampleJapanese": "私たちの先生は親切です。",
        "commonMistake": "Do not use a /ʃ/ sound in the middle.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "classroom"
      },
      "icon": "🧑‍🏫",
      "tags": [
        "classroom",
        "level-1",
        "teacher"
      ]
    },
    "after_fields": {
      "title_en": "teacher",
      "title_ja": "先生",
      "content": {
        "word": "teacher",
        "japanese": "先生",
        "kanaReading": "ティーチャー",
        "pronunciationHint": "Stress TEE and use /tʃ/ in the middle.",
        "exampleSentence": "This is my teacher.",
        "exampleJapanese": "こちらは私の先生です。",
        "commonMistake": "Do not use a /ʃ/ sound in the middle.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ceeae758c7ce6389.svg",
          "kind": "single",
          "altEn": "An illustration of teacher.",
          "altJa": "先生のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "classroom"
      },
      "icon": "",
      "tags": [
        "classroom",
        "level-1",
        "teacher"
      ]
    }
  },
  {
    "id": "word-l01-student",
    "category": "words",
    "level": 1,
    "before_fields": {
      "title_en": "student",
      "title_ja": "生徒",
      "content": {
        "word": "student",
        "japanese": "生徒",
        "kanaReading": "スチューデント",
        "pronunciationHint": "Stress STU and keep the final t light.",
        "exampleSentence": "Every student has a notebook.",
        "exampleJapanese": "生徒はみんなノートを持っています。",
        "commonMistake": "Do not drop the final t completely.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "classroom"
      },
      "icon": "🧑‍🎓",
      "tags": [
        "classroom",
        "level-1",
        "student"
      ]
    },
    "after_fields": {
      "title_en": "student",
      "title_ja": "生徒",
      "content": {
        "word": "student",
        "japanese": "生徒",
        "kanaReading": "スチューデント",
        "pronunciationHint": "Stress STU and keep the final t light.",
        "exampleSentence": "I'm a student.",
        "exampleJapanese": "私は生徒です。",
        "commonMistake": "Do not drop the final t completely.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d8e84519b250ae8f.svg",
          "kind": "single",
          "altEn": "A student studying at a desk with a book.",
          "altJa": "机で本を使って勉強している生徒。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "classroom"
      },
      "icon": "",
      "tags": [
        "classroom",
        "level-1",
        "student"
      ]
    }
  },
  {
    "id": "word-l01-lesson",
    "category": "words",
    "level": 1,
    "before_fields": {
      "title_en": "lesson",
      "title_ja": "レッスン・授業",
      "content": {
        "word": "lesson",
        "japanese": "レッスン・授業",
        "kanaReading": "レッスン",
        "pronunciationHint": "Stress LES; the second vowel is weak.",
        "exampleSentence": "The lesson starts at ten.",
        "exampleJapanese": "授業は10時に始まります。",
        "commonMistake": "Do not pronounce both syllables with equal stress.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "classroom"
      },
      "icon": "📝",
      "tags": [
        "classroom",
        "level-1",
        "lesson"
      ]
    },
    "after_fields": {
      "title_en": "lesson",
      "title_ja": "レッスン・授業",
      "content": {
        "word": "lesson",
        "japanese": "レッスン・授業",
        "kanaReading": "レッスン",
        "pronunciationHint": "Stress LES; the second vowel is weak.",
        "exampleSentence": "The lesson starts now.",
        "exampleJapanese": "今からレッスンが始まります。",
        "commonMistake": "Do not pronounce both syllables with equal stress.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-46f80c70c8e2515a.svg",
          "kind": "scene",
          "altEn": "A teacher and a student learning together in a classroom.",
          "altJa": "教室で先生と生徒が一緒に学んでいます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "classroom"
      },
      "icon": "",
      "tags": [
        "classroom",
        "level-1",
        "lesson"
      ]
    }
  },
  {
    "id": "word-l02-red",
    "category": "words",
    "level": 2,
    "before_fields": {
      "title_en": "red",
      "title_ja": "赤い",
      "content": {
        "word": "red",
        "japanese": "赤い",
        "kanaReading": "レッド",
        "pronunciationHint": "Keep the vowel short and the final d voiced.",
        "exampleSentence": "I have a red cup.",
        "exampleJapanese": "私は赤いカップを持っています。",
        "commonMistake": "Do not replace the r with an l sound.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "colors-and-shapes"
      },
      "icon": "🔴",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "red"
      ]
    },
    "after_fields": {
      "title_en": "red",
      "title_ja": "赤い",
      "content": {
        "word": "red",
        "japanese": "赤い",
        "kanaReading": "レッド",
        "pronunciationHint": "Keep the vowel short and the final d voiced.",
        "exampleSentence": "I have a red cup.",
        "exampleJapanese": "私は赤いカップを持っています。",
        "commonMistake": "Do not replace the r with an l sound.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ee602fca5e4fcc64.svg",
          "kind": "single",
          "altEn": "An illustration of red.",
          "altJa": "赤いのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "colors-and-shapes"
      },
      "icon": "",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "red"
      ]
    }
  },
  {
    "id": "word-l02-blue",
    "category": "words",
    "level": 2,
    "before_fields": {
      "title_en": "blue",
      "title_ja": "青い",
      "content": {
        "word": "blue",
        "japanese": "青い",
        "kanaReading": "ブルー",
        "pronunciationHint": "Blend /b/ and /l/ before the long /uː/.",
        "exampleSentence": "Her shoes are blue.",
        "exampleJapanese": "彼女の靴は青いです。",
        "commonMistake": "Do not insert a vowel between b and l.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "colors-and-shapes"
      },
      "icon": "🔵",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "blue"
      ]
    },
    "after_fields": {
      "title_en": "blue",
      "title_ja": "青い",
      "content": {
        "word": "blue",
        "japanese": "青い",
        "kanaReading": "ブルー",
        "pronunciationHint": "Blend /b/ and /l/ before the long /uː/.",
        "exampleSentence": "Her shoes are blue.",
        "exampleJapanese": "彼女の靴は青いです。",
        "commonMistake": "Do not insert a vowel between b and l.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-90b9fe855be22975.svg",
          "kind": "single",
          "altEn": "An illustration of blue.",
          "altJa": "青いのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "colors-and-shapes"
      },
      "icon": "",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "blue"
      ]
    }
  },
  {
    "id": "word-l02-yellow",
    "category": "words",
    "level": 2,
    "before_fields": {
      "title_en": "yellow",
      "title_ja": "黄色い",
      "content": {
        "word": "yellow",
        "japanese": "黄色い",
        "kanaReading": "イエロー",
        "pronunciationHint": "Begin with the consonant /j/, like “yes.”",
        "exampleSentence": "The yellow bus is here.",
        "exampleJapanese": "黄色いバスが来ました。",
        "commonMistake": "Do not begin with a Japanese-style strong イ sound.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "colors-and-shapes"
      },
      "icon": "🟡",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "yellow"
      ]
    },
    "after_fields": {
      "title_en": "yellow",
      "title_ja": "黄色い",
      "content": {
        "word": "yellow",
        "japanese": "黄色い",
        "kanaReading": "イエロー",
        "pronunciationHint": "Begin with the consonant /j/, like “yes.”",
        "exampleSentence": "The yellow bus is here.",
        "exampleJapanese": "黄色いバスが来ました。",
        "commonMistake": "Do not begin with a Japanese-style strong イ sound.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b5c6b65ec3581c8e.svg",
          "kind": "single",
          "altEn": "An illustration of yellow.",
          "altJa": "黄色いのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "colors-and-shapes"
      },
      "icon": "",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "yellow"
      ]
    }
  },
  {
    "id": "word-l02-green",
    "category": "words",
    "level": 2,
    "before_fields": {
      "title_en": "green",
      "title_ja": "緑の",
      "content": {
        "word": "green",
        "japanese": "緑の",
        "kanaReading": "グリーン",
        "pronunciationHint": "Blend /g/ and /r/, then hold /iː/.",
        "exampleSentence": "We saw a green bird.",
        "exampleJapanese": "私たちは緑の鳥を見ました。",
        "commonMistake": "Do not insert a vowel between g and r.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "colors-and-shapes"
      },
      "icon": "🟢",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "green"
      ]
    },
    "after_fields": {
      "title_en": "green",
      "title_ja": "緑の",
      "content": {
        "word": "green",
        "japanese": "緑の",
        "kanaReading": "グリーン",
        "pronunciationHint": "Blend /g/ and /r/, then hold /iː/.",
        "exampleSentence": "The bag is green.",
        "exampleJapanese": "かばんは緑色です。",
        "commonMistake": "Do not insert a vowel between g and r.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c8ee338cc68f204f.svg",
          "kind": "single",
          "altEn": "An illustration of green.",
          "altJa": "緑ののイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "colors-and-shapes"
      },
      "icon": "",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "green"
      ]
    }
  },
  {
    "id": "word-l02-black",
    "category": "words",
    "level": 2,
    "before_fields": {
      "title_en": "black",
      "title_ja": "黒い",
      "content": {
        "word": "black",
        "japanese": "黒い",
        "kanaReading": "ブラック",
        "pronunciationHint": "Use /æ/ and end with a crisp /k/.",
        "exampleSentence": "He wears a black hat.",
        "exampleJapanese": "彼は黒い帽子をかぶっています。",
        "commonMistake": "Do not add a vowel after the final k.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "colors-and-shapes"
      },
      "icon": "⚫",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "black"
      ]
    },
    "after_fields": {
      "title_en": "black",
      "title_ja": "黒い",
      "content": {
        "word": "black",
        "japanese": "黒い",
        "kanaReading": "ブラック",
        "pronunciationHint": "Use /æ/ and end with a crisp /k/.",
        "exampleSentence": "This is a black pen.",
        "exampleJapanese": "これは黒いペンです。",
        "commonMistake": "Do not add a vowel after the final k.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-092bc12c58ee022e.svg",
          "kind": "single",
          "altEn": "An illustration of black.",
          "altJa": "黒いのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "colors-and-shapes"
      },
      "icon": "",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "black"
      ]
    }
  },
  {
    "id": "word-l02-white",
    "category": "words",
    "level": 2,
    "before_fields": {
      "title_en": "white",
      "title_ja": "白い",
      "content": {
        "word": "white",
        "japanese": "白い",
        "kanaReading": "ホワイト",
        "pronunciationHint": "Start with rounded lips for /w/ and finish with t.",
        "exampleSentence": "The wall is white.",
        "exampleJapanese": "壁は白いです。",
        "commonMistake": "Do not drop the final t.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "colors-and-shapes"
      },
      "icon": "⚪",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "white"
      ]
    },
    "after_fields": {
      "title_en": "white",
      "title_ja": "白い",
      "content": {
        "word": "white",
        "japanese": "白い",
        "kanaReading": "ホワイト",
        "pronunciationHint": "Start with rounded lips for /w/ and finish with t.",
        "exampleSentence": "The wall is white.",
        "exampleJapanese": "壁は白いです。",
        "commonMistake": "Do not drop the final t.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5afdeda13090ec7e.svg",
          "kind": "single",
          "altEn": "An illustration of white.",
          "altJa": "白いのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "colors-and-shapes"
      },
      "icon": "",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "white"
      ]
    }
  },
  {
    "id": "word-l02-circle",
    "category": "words",
    "level": 2,
    "before_fields": {
      "title_en": "circle",
      "title_ja": "円・丸",
      "content": {
        "word": "circle",
        "japanese": "円・丸",
        "kanaReading": "サークル",
        "pronunciationHint": "Stress CIR; the second syllable is weak.",
        "exampleSentence": "Draw a circle around the answer.",
        "exampleJapanese": "答えを丸で囲んでください。",
        "commonMistake": "Do not pronounce the c as /k/ at the start.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "colors-and-shapes"
      },
      "icon": "⭕",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "circle"
      ]
    },
    "after_fields": {
      "title_en": "circle",
      "title_ja": "円・丸",
      "content": {
        "word": "circle",
        "japanese": "円・丸",
        "kanaReading": "サークル",
        "pronunciationHint": "Stress CIR; the second syllable is weak.",
        "exampleSentence": "Draw a circle.",
        "exampleJapanese": "丸を描いてください。",
        "commonMistake": "Do not pronounce the c as /k/ at the start.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-cfe9afeb3251a8f1.svg",
          "kind": "single",
          "altEn": "An illustration of circle.",
          "altJa": "円・丸のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "colors-and-shapes"
      },
      "icon": "",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "circle"
      ]
    }
  },
  {
    "id": "word-l02-square",
    "category": "words",
    "level": 2,
    "before_fields": {
      "title_en": "square",
      "title_ja": "正方形",
      "content": {
        "word": "square",
        "japanese": "正方形",
        "kanaReading": "スクウェア",
        "pronunciationHint": "Say the /skw/ cluster as one smooth start.",
        "exampleSentence": "This shape is a square.",
        "exampleJapanese": "この形は正方形です。",
        "commonMistake": "Do not separate s, k, and w with vowels.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "colors-and-shapes"
      },
      "icon": "🟥",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "square"
      ]
    },
    "after_fields": {
      "title_en": "square",
      "title_ja": "正方形",
      "content": {
        "word": "square",
        "japanese": "正方形",
        "kanaReading": "スクウェア",
        "pronunciationHint": "Say the /skw/ cluster as one smooth start.",
        "exampleSentence": "This shape is a square.",
        "exampleJapanese": "この形は正方形です。",
        "commonMistake": "Do not separate s, k, and w with vowels.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7699487ddd190639.svg",
          "kind": "single",
          "altEn": "An illustration of square.",
          "altJa": "正方形のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "colors-and-shapes"
      },
      "icon": "",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "square"
      ]
    }
  },
  {
    "id": "word-l02-star",
    "category": "words",
    "level": 2,
    "before_fields": {
      "title_en": "star",
      "title_ja": "星",
      "content": {
        "word": "star",
        "japanese": "星",
        "kanaReading": "スター",
        "pronunciationHint": "Open with /st/ and hold the central vowel.",
        "exampleSentence": "That star is bright.",
        "exampleJapanese": "あの星は明るいです。",
        "commonMistake": "Do not insert a vowel between s and t.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "colors-and-shapes"
      },
      "icon": "⭐",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "star"
      ]
    },
    "after_fields": {
      "title_en": "star",
      "title_ja": "星",
      "content": {
        "word": "star",
        "japanese": "星",
        "kanaReading": "スター",
        "pronunciationHint": "Join /s/ and /t/. US English ends with an r sound; the usual UK model has a long vowel without r.",
        "exampleSentence": "That star is bright.",
        "exampleJapanese": "あの星は明るいです。",
        "commonMistake": "Do not insert a vowel between s and t.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-9e6a6d9094fd8441.svg",
          "kind": "single",
          "altEn": "An illustration of star.",
          "altJa": "星のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "colors-and-shapes"
      },
      "icon": "",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "star"
      ]
    }
  },
  {
    "id": "word-l02-line",
    "category": "words",
    "level": 2,
    "before_fields": {
      "title_en": "line",
      "title_ja": "線・列",
      "content": {
        "word": "line",
        "japanese": "線・列",
        "kanaReading": "ライン",
        "pronunciationHint": "Use the /aɪ/ sound, as in “eye.”",
        "exampleSentence": "Stand in a straight line.",
        "exampleJapanese": "まっすぐ一列に並んでください。",
        "commonMistake": "Do not pronounce it like “lean.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "colors-and-shapes"
      },
      "icon": "➖",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "line"
      ]
    },
    "after_fields": {
      "title_en": "line",
      "title_ja": "線",
      "content": {
        "word": "line",
        "japanese": "線",
        "kanaReading": "ライン",
        "pronunciationHint": "Use the /aɪ/ sound, as in “eye.”",
        "exampleSentence": "Draw a straight line.",
        "exampleJapanese": "まっすぐな線を描いてください。",
        "commonMistake": "For the shape, say “draw a line.” “Stand in line” uses the separate meaning of a queue.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-782b41ce541cbf91.svg",
          "kind": "single",
          "altEn": "An illustration of line.",
          "altJa": "線のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "colors-and-shapes"
      },
      "icon": "",
      "tags": [
        "colors-and-shapes",
        "level-2",
        "line"
      ]
    }
  },
  {
    "id": "word-l03-mother",
    "category": "words",
    "level": 3,
    "before_fields": {
      "title_en": "mother",
      "title_ja": "母・お母さん",
      "content": {
        "word": "mother",
        "japanese": "母・お母さん",
        "kanaReading": "マザー",
        "pronunciationHint": "Voice the middle th /ð/ as in “this.”",
        "exampleSentence": "My mother likes music.",
        "exampleJapanese": "私の母は音楽が好きです。",
        "commonMistake": "Do not use the unvoiced th from “think.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "family-and-people"
      },
      "icon": "👩",
      "tags": [
        "family-and-people",
        "level-3",
        "mother"
      ]
    },
    "after_fields": {
      "title_en": "mother",
      "title_ja": "母・お母さん",
      "content": {
        "word": "mother",
        "japanese": "母・お母さん",
        "kanaReading": "マザー",
        "pronunciationHint": "Voice the middle th /ð/ as in “this.”",
        "exampleSentence": "My mother likes music.",
        "exampleJapanese": "私の母は音楽が好きです。",
        "commonMistake": "Do not use the unvoiced th from “think.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ecb41a4a18eafc6c.svg",
          "kind": "single",
          "altEn": "An illustration of mother.",
          "altJa": "母・お母さんのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "family-and-people"
      },
      "icon": "",
      "tags": [
        "family-and-people",
        "level-3",
        "mother"
      ]
    }
  },
  {
    "id": "word-l03-father",
    "category": "words",
    "level": 3,
    "before_fields": {
      "title_en": "father",
      "title_ja": "父・お父さん",
      "content": {
        "word": "father",
        "japanese": "父・お父さん",
        "kanaReading": "ファーザー",
        "pronunciationHint": "Use a voiced /ð/ in the middle.",
        "exampleSentence": "My father cooks on Sunday.",
        "exampleJapanese": "私の父は日曜日に料理をします。",
        "commonMistake": "Do not replace th with a z sound.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "family-and-people"
      },
      "icon": "👨",
      "tags": [
        "family-and-people",
        "level-3",
        "father"
      ]
    },
    "after_fields": {
      "title_en": "father",
      "title_ja": "父・お父さん",
      "content": {
        "word": "father",
        "japanese": "父・お父さん",
        "kanaReading": "ファーザー",
        "pronunciationHint": "Use a voiced /ð/ in the middle.",
        "exampleSentence": "My father cooks on Sunday.",
        "exampleJapanese": "私の父は日曜日に料理をします。",
        "commonMistake": "Do not replace th with a z sound.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-2e4a9dc2059351a5.svg",
          "kind": "single",
          "altEn": "An illustration of father.",
          "altJa": "父・お父さんのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "family-and-people"
      },
      "icon": "",
      "tags": [
        "family-and-people",
        "level-3",
        "father"
      ]
    }
  },
  {
    "id": "word-l03-sister",
    "category": "words",
    "level": 3,
    "before_fields": {
      "title_en": "sister",
      "title_ja": "姉・妹",
      "content": {
        "word": "sister",
        "japanese": "姉・妹",
        "kanaReading": "シスター",
        "pronunciationHint": "Stress SIS and keep the second vowel weak.",
        "exampleSentence": "My sister plays tennis.",
        "exampleJapanese": "私の姉はテニスをします。",
        "commonMistake": "Do not strongly pronounce both syllables.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "family-and-people"
      },
      "icon": "👧",
      "tags": [
        "family-and-people",
        "level-3",
        "sister"
      ]
    },
    "after_fields": {
      "title_en": "sister",
      "title_ja": "姉・妹",
      "content": {
        "word": "sister",
        "japanese": "姉・妹",
        "kanaReading": "シスター",
        "pronunciationHint": "Stress SIS and keep the second vowel weak.",
        "exampleSentence": "My sister plays tennis.",
        "exampleJapanese": "私の姉はテニスをします。",
        "commonMistake": "Do not strongly pronounce both syllables.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-71d9a8bbe96cc83c.svg",
          "kind": "single",
          "altEn": "An illustration of sister.",
          "altJa": "姉・妹のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "family-and-people"
      },
      "icon": "",
      "tags": [
        "family-and-people",
        "level-3",
        "sister"
      ]
    }
  },
  {
    "id": "word-l03-brother",
    "category": "words",
    "level": 3,
    "before_fields": {
      "title_en": "brother",
      "title_ja": "兄・弟",
      "content": {
        "word": "brother",
        "japanese": "兄・弟",
        "kanaReading": "ブラザー",
        "pronunciationHint": "Blend /b/ and /r/ and voice the th.",
        "exampleSentence": "Her brother is twelve.",
        "exampleJapanese": "彼女の弟は12歳です。",
        "commonMistake": "Do not insert a vowel between b and r.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "family-and-people"
      },
      "icon": "👦",
      "tags": [
        "family-and-people",
        "level-3",
        "brother"
      ]
    },
    "after_fields": {
      "title_en": "brother",
      "title_ja": "兄・弟",
      "content": {
        "word": "brother",
        "japanese": "兄・弟",
        "kanaReading": "ブラザー",
        "pronunciationHint": "Blend /b/ and /r/ and voice the th.",
        "exampleSentence": "Her brother is twelve.",
        "exampleJapanese": "彼女の弟は12歳です。",
        "commonMistake": "Do not insert a vowel between b and r.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-8e1dcd80b5368e32.svg",
          "kind": "single",
          "altEn": "An illustration of brother.",
          "altJa": "兄・弟のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "family-and-people"
      },
      "icon": "",
      "tags": [
        "family-and-people",
        "level-3",
        "brother"
      ]
    }
  },
  {
    "id": "word-l03-grandmother",
    "category": "words",
    "level": 3,
    "before_fields": {
      "title_en": "grandmother",
      "title_ja": "祖母・おばあさん",
      "content": {
        "word": "grandmother",
        "japanese": "祖母・おばあさん",
        "kanaReading": "グランドマザー",
        "pronunciationHint": "Stress GRAND. In natural speech, the d may be light or absent depending on the speaker.",
        "exampleSentence": "My grandmother tells funny stories.",
        "exampleJapanese": "私の祖母は面白い話をしてくれます。",
        "commonMistake": "Both /ɡrænd-/ and /ɡræn-/ are heard; do not force an extra vowel between the two parts.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "family-and-people"
      },
      "icon": "👵",
      "tags": [
        "family-and-people",
        "level-3",
        "grandmother"
      ]
    },
    "after_fields": {
      "title_en": "grandmother",
      "title_ja": "祖母・おばあさん",
      "content": {
        "word": "grandmother",
        "japanese": "祖母・おばあさん",
        "kanaReading": "グランドマザー",
        "pronunciationHint": "Stress GRAND. In natural speech, the d may be light or absent depending on the speaker.",
        "exampleSentence": "My grandmother is kind.",
        "exampleJapanese": "私の祖母は親切です。",
        "commonMistake": "Both /ɡrænd-/ and /ɡræn-/ are heard; do not force an extra vowel between the two parts.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-87c7bb60c9a2f54d.svg",
          "kind": "single",
          "altEn": "An illustration of grandmother.",
          "altJa": "祖母・おばあさんのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "family-and-people"
      },
      "icon": "",
      "tags": [
        "family-and-people",
        "level-3",
        "grandmother"
      ]
    }
  },
  {
    "id": "word-l03-grandfather",
    "category": "words",
    "level": 3,
    "before_fields": {
      "title_en": "grandfather",
      "title_ja": "祖父・おじいさん",
      "content": {
        "word": "grandfather",
        "japanese": "祖父・おじいさん",
        "kanaReading": "グランドファーザー",
        "pronunciationHint": "Stress GRAND. The d is often light or absent before f in natural speech.",
        "exampleSentence": "His grandfather grows tomatoes.",
        "exampleJapanese": "彼の祖父はトマトを育てています。",
        "commonMistake": "Connect “grand” and “father” without a full pause, and use a voiced th in “father.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "family-and-people"
      },
      "icon": "👴",
      "tags": [
        "family-and-people",
        "level-3",
        "grandfather"
      ]
    },
    "after_fields": {
      "title_en": "grandfather",
      "title_ja": "祖父・おじいさん",
      "content": {
        "word": "grandfather",
        "japanese": "祖父・おじいさん",
        "kanaReading": "グランドファーザー",
        "pronunciationHint": "Stress GRAND. The d is often light or absent before f in natural speech.",
        "exampleSentence": "My grandfather likes books.",
        "exampleJapanese": "私の祖父は本が好きです。",
        "commonMistake": "Connect “grand” and “father” without a full pause, and use a voiced th in “father.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b4d6ae918d1c327e.svg",
          "kind": "single",
          "altEn": "An illustration of grandfather.",
          "altJa": "祖父・おじいさんのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "family-and-people"
      },
      "icon": "",
      "tags": [
        "family-and-people",
        "level-3",
        "grandfather"
      ]
    }
  },
  {
    "id": "word-l03-baby",
    "category": "words",
    "level": 3,
    "before_fields": {
      "title_en": "baby",
      "title_ja": "赤ちゃん",
      "content": {
        "word": "baby",
        "japanese": "赤ちゃん",
        "kanaReading": "ベイビー",
        "pronunciationHint": "Stress BAY and use a long /eɪ/.",
        "exampleSentence": "The baby is sleeping.",
        "exampleJapanese": "赤ちゃんは眠っています。",
        "commonMistake": "Do not make the first vowel short.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "family-and-people"
      },
      "icon": "👶",
      "tags": [
        "family-and-people",
        "level-3",
        "baby"
      ]
    },
    "after_fields": {
      "title_en": "baby",
      "title_ja": "赤ちゃん",
      "content": {
        "word": "baby",
        "japanese": "赤ちゃん",
        "kanaReading": "ベイビー",
        "pronunciationHint": "Stress BAY and use a long /eɪ/.",
        "exampleSentence": "The baby is sleeping.",
        "exampleJapanese": "赤ちゃんは眠っています。",
        "commonMistake": "Do not make the first vowel short.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-9caa3b17023dd332.svg",
          "kind": "single",
          "altEn": "An illustration of baby.",
          "altJa": "赤ちゃんのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "family-and-people"
      },
      "icon": "",
      "tags": [
        "family-and-people",
        "level-3",
        "baby"
      ]
    }
  },
  {
    "id": "word-l03-friend",
    "category": "words",
    "level": 3,
    "before_fields": {
      "title_en": "friend",
      "title_ja": "友達",
      "content": {
        "word": "friend",
        "japanese": "友達",
        "kanaReading": "フレンド",
        "pronunciationHint": "Blend /f/ and /r/ and keep the final d.",
        "exampleSentence": "Mika is my best friend.",
        "exampleJapanese": "ミカは私の親友です。",
        "commonMistake": "Do not add a vowel after the final d.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "family-and-people"
      },
      "icon": "🧑‍🤝‍🧑",
      "tags": [
        "family-and-people",
        "level-3",
        "friend"
      ]
    },
    "after_fields": {
      "title_en": "friend",
      "title_ja": "友達",
      "content": {
        "word": "friend",
        "japanese": "友達",
        "kanaReading": "フレンド",
        "pronunciationHint": "Blend /f/ and /r/ and keep the final d.",
        "exampleSentence": "Mika is my best friend.",
        "exampleJapanese": "ミカは私の親友です。",
        "commonMistake": "Do not add a vowel after the final d.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4d8f7bd78e7197b7.svg",
          "kind": "single",
          "altEn": "Two friends holding hands.",
          "altJa": "友達同士が手をつないでいます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "family-and-people"
      },
      "icon": "",
      "tags": [
        "family-and-people",
        "level-3",
        "friend"
      ]
    }
  },
  {
    "id": "word-l03-boy",
    "category": "words",
    "level": 3,
    "before_fields": {
      "title_en": "boy",
      "title_ja": "男の子",
      "content": {
        "word": "boy",
        "japanese": "男の子",
        "kanaReading": "ボーイ",
        "pronunciationHint": "Glide smoothly through /ɔɪ/.",
        "exampleSentence": "The boy has a blue kite.",
        "exampleJapanese": "その男の子は青い凧を持っています。",
        "commonMistake": "Do not split the vowel into two syllables.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "family-and-people"
      },
      "icon": "🧒",
      "tags": [
        "family-and-people",
        "level-3",
        "boy"
      ]
    },
    "after_fields": {
      "title_en": "boy",
      "title_ja": "男の子",
      "content": {
        "word": "boy",
        "japanese": "男の子",
        "kanaReading": "ボーイ",
        "pronunciationHint": "Glide smoothly through /ɔɪ/.",
        "exampleSentence": "The boy has a blue kite.",
        "exampleJapanese": "その男の子は青い凧を持っています。",
        "commonMistake": "Do not split the vowel into two syllables.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4870abbef8b55da2.svg",
          "kind": "single",
          "altEn": "A portrait of a boy.",
          "altJa": "男の子の顔。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "family-and-people"
      },
      "icon": "",
      "tags": [
        "family-and-people",
        "level-3",
        "boy"
      ]
    }
  },
  {
    "id": "word-l03-girl",
    "category": "words",
    "level": 3,
    "before_fields": {
      "title_en": "girl",
      "title_ja": "女の子",
      "content": {
        "word": "girl",
        "japanese": "女の子",
        "kanaReading": "ガール",
        "pronunciationHint": "Hold the central vowel and finish with l.",
        "exampleSentence": "The girl is reading.",
        "exampleJapanese": "その女の子は本を読んでいます。",
        "commonMistake": "Do not add a vowel after the final l.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "family-and-people"
      },
      "icon": "👧",
      "tags": [
        "family-and-people",
        "level-3",
        "girl"
      ]
    },
    "after_fields": {
      "title_en": "girl",
      "title_ja": "女の子",
      "content": {
        "word": "girl",
        "japanese": "女の子",
        "kanaReading": "ガール",
        "pronunciationHint": "Hold the central vowel and finish with l.",
        "exampleSentence": "The girl is reading.",
        "exampleJapanese": "その女の子は本を読んでいます。",
        "commonMistake": "Do not add a vowel after the final l.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-dea71467df7d5509.svg",
          "kind": "single",
          "altEn": "A portrait of a girl.",
          "altJa": "女の子の顔。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "family-and-people"
      },
      "icon": "",
      "tags": [
        "family-and-people",
        "level-3",
        "girl"
      ]
    }
  },
  {
    "id": "word-l04-head",
    "category": "words",
    "level": 4,
    "before_fields": {
      "title_en": "head",
      "title_ja": "頭",
      "content": {
        "word": "head",
        "japanese": "頭",
        "kanaReading": "ヘッド",
        "pronunciationHint": "Use the short /e/ sound in “bed.”",
        "exampleSentence": "Put the hat on your head.",
        "exampleJapanese": "帽子を頭にかぶってください。",
        "commonMistake": "Do not pronounce it like “heed.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "body"
      },
      "icon": "🙂",
      "tags": [
        "body",
        "level-4",
        "head"
      ]
    },
    "after_fields": {
      "title_en": "head",
      "title_ja": "頭",
      "content": {
        "word": "head",
        "japanese": "頭",
        "kanaReading": "ヘッド",
        "pronunciationHint": "Use the short /e/ sound in “bed.”",
        "exampleSentence": "Touch your head.",
        "exampleJapanese": "頭を触ってください。",
        "commonMistake": "Do not pronounce it like “heed.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-30b00250f6c09a54.svg",
          "kind": "single",
          "altEn": "An illustration of head.",
          "altJa": "頭のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "body"
      },
      "icon": "",
      "tags": [
        "body",
        "level-4",
        "head"
      ]
    }
  },
  {
    "id": "word-l04-face",
    "category": "words",
    "level": 4,
    "before_fields": {
      "title_en": "face",
      "title_ja": "顔",
      "content": {
        "word": "face",
        "japanese": "顔",
        "kanaReading": "フェイス",
        "pronunciationHint": "Use the long /eɪ/ sound and finish with /s/.",
        "exampleSentence": "Wash your face with warm water.",
        "exampleJapanese": "ぬるま湯で顔を洗ってください。",
        "commonMistake": "The final sound is /s/, not /z/.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "body"
      },
      "icon": "😀",
      "tags": [
        "body",
        "level-4",
        "face"
      ]
    },
    "after_fields": {
      "title_en": "face",
      "title_ja": "顔",
      "content": {
        "word": "face",
        "japanese": "顔",
        "kanaReading": "フェイス",
        "pronunciationHint": "Use the long /eɪ/ sound and finish with /s/.",
        "exampleSentence": "Wash your face.",
        "exampleJapanese": "顔を洗ってください。",
        "commonMistake": "The final sound is /s/, not /z/.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-2a1d989a9126cb18.svg",
          "kind": "single",
          "altEn": "An illustration of face.",
          "altJa": "顔のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "body"
      },
      "icon": "",
      "tags": [
        "body",
        "level-4",
        "face"
      ]
    }
  },
  {
    "id": "word-l04-eye",
    "category": "words",
    "level": 4,
    "before_fields": {
      "title_en": "eye",
      "title_ja": "目",
      "content": {
        "word": "eye",
        "japanese": "目",
        "kanaReading": "アイ",
        "pronunciationHint": "This is one vowel sound: /aɪ/.",
        "exampleSentence": "Something is in my eye.",
        "exampleJapanese": "目に何か入っています。",
        "commonMistake": "Do not add a y sound after the word.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "body"
      },
      "icon": "👁️",
      "tags": [
        "body",
        "level-4",
        "eye"
      ]
    },
    "after_fields": {
      "title_en": "eye",
      "title_ja": "目",
      "content": {
        "word": "eye",
        "japanese": "目",
        "kanaReading": "アイ",
        "pronunciationHint": "This is one vowel sound: /aɪ/.",
        "exampleSentence": "Something is in my eye.",
        "exampleJapanese": "目に何か入っています。",
        "commonMistake": "Do not add a y sound after the word.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-021242f369736966.svg",
          "kind": "single",
          "altEn": "An illustration of eye.",
          "altJa": "目のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "body"
      },
      "icon": "",
      "tags": [
        "body",
        "level-4",
        "eye"
      ]
    }
  },
  {
    "id": "word-l04-ear",
    "category": "words",
    "level": 4,
    "before_fields": {
      "title_en": "ear",
      "title_ja": "耳",
      "content": {
        "word": "ear",
        "japanese": "耳",
        "kanaReading": "イア",
        "pronunciationHint": "Begin with /ɪ/ and glide gently toward r.",
        "exampleSentence": "My left ear hurts.",
        "exampleJapanese": "左耳が痛いです。",
        "commonMistake": "Do not pronounce it the same as “year.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "body"
      },
      "icon": "👂",
      "tags": [
        "body",
        "level-4",
        "ear"
      ]
    },
    "after_fields": {
      "title_en": "ear",
      "title_ja": "耳",
      "content": {
        "word": "ear",
        "japanese": "耳",
        "kanaReading": "イア",
        "pronunciationHint": "Start with a relaxed /ɪ/. US English ends in r; the usual UK model does not pronounce a final r here.",
        "exampleSentence": "My left ear hurts.",
        "exampleJapanese": "左耳が痛いです。",
        "commonMistake": "Do not pronounce it the same as “year.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-3f394b1186a375d0.svg",
          "kind": "single",
          "altEn": "An illustration of ear.",
          "altJa": "耳のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "body"
      },
      "icon": "",
      "tags": [
        "body",
        "level-4",
        "ear"
      ]
    }
  },
  {
    "id": "word-l04-nose",
    "category": "words",
    "level": 4,
    "before_fields": {
      "title_en": "nose",
      "title_ja": "鼻",
      "content": {
        "word": "nose",
        "japanese": "鼻",
        "kanaReading": "ノウズ",
        "pronunciationHint": "Use /oʊ/ and a voiced final /z/.",
        "exampleSentence": "The dog has a wet nose.",
        "exampleJapanese": "その犬は鼻がぬれています。",
        "commonMistake": "The final sound is /z/, not /s/.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "body"
      },
      "icon": "👃",
      "tags": [
        "body",
        "level-4",
        "nose"
      ]
    },
    "after_fields": {
      "title_en": "nose",
      "title_ja": "鼻",
      "content": {
        "word": "nose",
        "japanese": "鼻",
        "kanaReading": "ノウズ",
        "pronunciationHint": "Use /oʊ/ and a voiced final /z/.",
        "exampleSentence": "The dog has a wet nose.",
        "exampleJapanese": "その犬は鼻がぬれています。",
        "commonMistake": "The final sound is /z/, not /s/.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-41beb8f12f2df5b6.svg",
          "kind": "single",
          "altEn": "The nose is highlighted on a face seen from the side.",
          "altJa": "横顔の鼻を丸で示しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "body"
      },
      "icon": "",
      "tags": [
        "body",
        "level-4",
        "nose"
      ]
    }
  },
  {
    "id": "word-l04-mouth",
    "category": "words",
    "level": 4,
    "before_fields": {
      "title_en": "mouth",
      "title_ja": "口",
      "content": {
        "word": "mouth",
        "japanese": "口",
        "kanaReading": "マウス",
        "pronunciationHint": "End with the unvoiced th /θ/.",
        "exampleSentence": "Open your mouth wide.",
        "exampleJapanese": "口を大きく開けてください。",
        "commonMistake": "Do not pronounce it like the computer “mouse.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "body"
      },
      "icon": "👄",
      "tags": [
        "body",
        "level-4",
        "mouth"
      ]
    },
    "after_fields": {
      "title_en": "mouth",
      "title_ja": "口",
      "content": {
        "word": "mouth",
        "japanese": "口",
        "kanaReading": "マウス",
        "pronunciationHint": "End with the unvoiced th /θ/.",
        "exampleSentence": "Open your mouth wide.",
        "exampleJapanese": "口を大きく開けてください。",
        "commonMistake": "Do not pronounce it like the computer “mouse.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-db0583da2342d440.svg",
          "kind": "single",
          "altEn": "An illustration of mouth.",
          "altJa": "口のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "body"
      },
      "icon": "",
      "tags": [
        "body",
        "level-4",
        "mouth"
      ]
    }
  },
  {
    "id": "word-l04-hand",
    "category": "words",
    "level": 4,
    "before_fields": {
      "title_en": "hand",
      "title_ja": "手",
      "content": {
        "word": "hand",
        "japanese": "手",
        "kanaReading": "ハンド",
        "pronunciationHint": "Use /æ/ and keep the final d.",
        "exampleSentence": "Raise your hand if you know.",
        "exampleJapanese": "分かったら手を挙げてください。",
        "commonMistake": "Do not drop the final d.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "body"
      },
      "icon": "✋",
      "tags": [
        "body",
        "level-4",
        "hand"
      ]
    },
    "after_fields": {
      "title_en": "hand",
      "title_ja": "手",
      "content": {
        "word": "hand",
        "japanese": "手",
        "kanaReading": "ハンド",
        "pronunciationHint": "Use /æ/ and keep the final d.",
        "exampleSentence": "Raise your hand.",
        "exampleJapanese": "手を挙げてください。",
        "commonMistake": "Do not drop the final d.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d4d6a369a8ebd9e6.svg",
          "kind": "single",
          "altEn": "An illustration of hand.",
          "altJa": "手のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "body"
      },
      "icon": "",
      "tags": [
        "body",
        "level-4",
        "hand"
      ]
    }
  },
  {
    "id": "word-l04-foot",
    "category": "words",
    "level": 4,
    "before_fields": {
      "title_en": "foot",
      "title_ja": "足・足首から下",
      "content": {
        "word": "foot",
        "japanese": "足・足首から下",
        "kanaReading": "フット",
        "pronunciationHint": "Use short /ʊ/, not long /uː/.",
        "exampleSentence": "My right foot is cold.",
        "exampleJapanese": "右足が冷たいです。",
        "commonMistake": "The plural is “feet,” not “foots.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "body"
      },
      "icon": "🦶",
      "tags": [
        "body",
        "level-4",
        "foot"
      ]
    },
    "after_fields": {
      "title_en": "foot",
      "title_ja": "足・足首から下",
      "content": {
        "word": "foot",
        "japanese": "足・足首から下",
        "kanaReading": "フット",
        "pronunciationHint": "Use short /ʊ/, not long /uː/.",
        "exampleSentence": "My right foot is cold.",
        "exampleJapanese": "右足が冷たいです。",
        "commonMistake": "The plural is “feet,” not “foots.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-981d15f05e5bdf5d.svg",
          "kind": "single",
          "altEn": "An illustration of foot.",
          "altJa": "足・足首から下のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "body"
      },
      "icon": "",
      "tags": [
        "body",
        "level-4",
        "foot"
      ]
    }
  },
  {
    "id": "word-l04-arm",
    "category": "words",
    "level": 4,
    "before_fields": {
      "title_en": "arm",
      "title_ja": "腕",
      "content": {
        "word": "arm",
        "japanese": "腕",
        "kanaReading": "アーム",
        "pronunciationHint": "Hold the vowel; pronounce r lightly in US English.",
        "exampleSentence": "She carried the box in one arm.",
        "exampleJapanese": "彼女は片腕で箱を運びました。",
        "commonMistake": "Do not confuse “arm” with “hand.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "body"
      },
      "icon": "💪",
      "tags": [
        "body",
        "level-4",
        "arm"
      ]
    },
    "after_fields": {
      "title_en": "arm",
      "title_ja": "腕",
      "content": {
        "word": "arm",
        "japanese": "腕",
        "kanaReading": "アーム",
        "pronunciationHint": "Hold the vowel; pronounce r lightly in US English.",
        "exampleSentence": "Raise your right arm.",
        "exampleJapanese": "右腕を上げてください。",
        "commonMistake": "Do not confuse “arm” with “hand.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c5410fbad029fb75.svg",
          "kind": "single",
          "altEn": "An illustration of arm.",
          "altJa": "腕のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "body"
      },
      "icon": "",
      "tags": [
        "body",
        "level-4",
        "arm"
      ]
    }
  },
  {
    "id": "word-l04-leg",
    "category": "words",
    "level": 4,
    "before_fields": {
      "title_en": "leg",
      "title_ja": "脚",
      "content": {
        "word": "leg",
        "japanese": "脚",
        "kanaReading": "レッグ",
        "pronunciationHint": "Use a short /e/ and a firm final g.",
        "exampleSentence": "Stretch each leg slowly.",
        "exampleJapanese": "両脚をゆっくり伸ばしてください。",
        "commonMistake": "Do not add a vowel after the final g.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "body"
      },
      "icon": "🦵",
      "tags": [
        "body",
        "level-4",
        "leg"
      ]
    },
    "after_fields": {
      "title_en": "leg",
      "title_ja": "脚",
      "content": {
        "word": "leg",
        "japanese": "脚",
        "kanaReading": "レッグ",
        "pronunciationHint": "Use a short /e/ and a firm final g.",
        "exampleSentence": "My left leg hurts.",
        "exampleJapanese": "左脚が痛いです。",
        "commonMistake": "Do not add a vowel after the final g.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-edcf0c52e943b9b0.svg",
          "kind": "single",
          "altEn": "An illustration of leg.",
          "altJa": "脚のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "body"
      },
      "icon": "",
      "tags": [
        "body",
        "level-4",
        "leg"
      ]
    }
  },
  {
    "id": "word-l05-rice",
    "category": "words",
    "level": 5,
    "before_fields": {
      "title_en": "rice",
      "title_ja": "ご飯・米",
      "content": {
        "word": "rice",
        "japanese": "ご飯・米",
        "kanaReading": "ライス",
        "pronunciationHint": "Use /aɪ/ and finish with /s/.",
        "exampleSentence": "We eat rice with dinner.",
        "exampleJapanese": "私たちは夕食にご飯を食べます。",
        "commonMistake": "“Rice” is normally uncountable; avoid “a rice.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "food-and-drink"
      },
      "icon": "🍚",
      "tags": [
        "food-and-drink",
        "level-5",
        "rice"
      ]
    },
    "after_fields": {
      "title_en": "rice",
      "title_ja": "ご飯・米",
      "content": {
        "word": "rice",
        "japanese": "ご飯・米",
        "kanaReading": "ライス",
        "pronunciationHint": "Use /aɪ/ and finish with /s/.",
        "exampleSentence": "We eat rice with dinner.",
        "exampleJapanese": "私たちは夕食にご飯を食べます。",
        "commonMistake": "“Rice” is normally uncountable; avoid “a rice.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-aa99b3c0cbba43ff.svg",
          "kind": "single",
          "altEn": "An illustration of rice.",
          "altJa": "ご飯・米のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "food-and-drink"
      },
      "icon": "",
      "tags": [
        "food-and-drink",
        "level-5",
        "rice"
      ]
    }
  },
  {
    "id": "word-l05-bread",
    "category": "words",
    "level": 5,
    "before_fields": {
      "title_en": "bread",
      "title_ja": "パン",
      "content": {
        "word": "bread",
        "japanese": "パン",
        "kanaReading": "ブレッド",
        "pronunciationHint": "Use the short /e/ in “bed.”",
        "exampleSentence": "I made toast with this bread.",
        "exampleJapanese": "このパンでトーストを作りました。",
        "commonMistake": "“Bread” is uncountable; say “a slice of bread.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "food-and-drink"
      },
      "icon": "🍞",
      "tags": [
        "food-and-drink",
        "level-5",
        "bread"
      ]
    },
    "after_fields": {
      "title_en": "bread",
      "title_ja": "パン",
      "content": {
        "word": "bread",
        "japanese": "パン",
        "kanaReading": "ブレッド",
        "pronunciationHint": "Use the short /e/ in “bed.”",
        "exampleSentence": "I like bread.",
        "exampleJapanese": "私はパンが好きです。",
        "commonMistake": "“Bread” is uncountable; say “a slice of bread.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-6ed387946e99a9b3.svg",
          "kind": "single",
          "altEn": "An illustration of bread.",
          "altJa": "パンのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "food-and-drink"
      },
      "icon": "",
      "tags": [
        "food-and-drink",
        "level-5",
        "bread"
      ]
    }
  },
  {
    "id": "word-l05-egg",
    "category": "words",
    "level": 5,
    "before_fields": {
      "title_en": "egg",
      "title_ja": "卵",
      "content": {
        "word": "egg",
        "japanese": "卵",
        "kanaReading": "エッグ",
        "pronunciationHint": "Start with a short /e/ and finish with g.",
        "exampleSentence": "Would you like an egg?",
        "exampleJapanese": "卵はいかがですか。",
        "commonMistake": "Use “an,” not “a,” before “egg.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "food-and-drink"
      },
      "icon": "🥚",
      "tags": [
        "food-and-drink",
        "level-5",
        "egg"
      ]
    },
    "after_fields": {
      "title_en": "egg",
      "title_ja": "卵",
      "content": {
        "word": "egg",
        "japanese": "卵",
        "kanaReading": "エッグ",
        "pronunciationHint": "Start with a short /e/ and finish with g.",
        "exampleSentence": "I have an egg.",
        "exampleJapanese": "私は卵を1つ持っています。",
        "commonMistake": "Use “an,” not “a,” before “egg.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-9dbc185611d2c14a.svg",
          "kind": "single",
          "altEn": "An illustration of egg.",
          "altJa": "卵のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "food-and-drink"
      },
      "icon": "",
      "tags": [
        "food-and-drink",
        "level-5",
        "egg"
      ]
    }
  },
  {
    "id": "word-l05-milk",
    "category": "words",
    "level": 5,
    "before_fields": {
      "title_en": "milk",
      "title_ja": "牛乳",
      "content": {
        "word": "milk",
        "japanese": "牛乳",
        "kanaReading": "ミルク",
        "pronunciationHint": "Finish with the /lk/ cluster without an extra vowel.",
        "exampleSentence": "Please put the milk in the fridge.",
        "exampleJapanese": "牛乳を冷蔵庫に入れてください。",
        "commonMistake": "“Milk” is usually uncountable.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "food-and-drink"
      },
      "icon": "🥛",
      "tags": [
        "food-and-drink",
        "level-5",
        "milk"
      ]
    },
    "after_fields": {
      "title_en": "milk",
      "title_ja": "牛乳",
      "content": {
        "word": "milk",
        "japanese": "牛乳",
        "kanaReading": "ミルク",
        "pronunciationHint": "Finish with the /lk/ cluster without an extra vowel.",
        "exampleSentence": "I drink milk.",
        "exampleJapanese": "私は牛乳を飲みます。",
        "commonMistake": "“Milk” is usually uncountable.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-293038ab318cf2ad.svg",
          "kind": "single",
          "altEn": "An illustration of milk.",
          "altJa": "牛乳のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "food-and-drink"
      },
      "icon": "",
      "tags": [
        "food-and-drink",
        "level-5",
        "milk"
      ]
    }
  },
  {
    "id": "word-l05-water",
    "category": "words",
    "level": 5,
    "before_fields": {
      "title_en": "water",
      "title_ja": "水",
      "content": {
        "word": "water",
        "japanese": "水",
        "kanaReading": "ウォーター",
        "pronunciationHint": "In US speech, the middle t often sounds like a quick d.",
        "exampleSentence": "Could I have some water?",
        "exampleJapanese": "お水をいただけますか。",
        "commonMistake": "Do not say “a water” unless you mean one serving.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "food-and-drink"
      },
      "icon": "💧",
      "tags": [
        "food-and-drink",
        "level-5",
        "water"
      ]
    },
    "after_fields": {
      "title_en": "water",
      "title_ja": "水",
      "content": {
        "word": "water",
        "japanese": "水",
        "kanaReading": "ウォーター",
        "pronunciationHint": "In US speech, the middle t often sounds like a quick d.",
        "exampleSentence": "Could I have some water?",
        "exampleJapanese": "お水をいただけますか。",
        "commonMistake": "Do not say “a water” unless you mean one serving.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-2c6bb5e19cb56ef1.svg",
          "kind": "single",
          "altEn": "An illustration of water.",
          "altJa": "水のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "food-and-drink"
      },
      "icon": "",
      "tags": [
        "food-and-drink",
        "level-5",
        "water"
      ]
    }
  },
  {
    "id": "word-l05-apple",
    "category": "words",
    "level": 5,
    "before_fields": {
      "title_en": "apple",
      "title_ja": "りんご",
      "content": {
        "word": "apple",
        "japanese": "りんご",
        "kanaReading": "アップル",
        "pronunciationHint": "Stress AP and use /æ/ at the start.",
        "exampleSentence": "I cut the apple in half.",
        "exampleJapanese": "りんごを半分に切りました。",
        "commonMistake": "Use “an apple,” not “a apple.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "food-and-drink"
      },
      "icon": "🍎",
      "tags": [
        "food-and-drink",
        "level-5",
        "apple"
      ]
    },
    "after_fields": {
      "title_en": "apple",
      "title_ja": "りんご",
      "content": {
        "word": "apple",
        "japanese": "りんご",
        "kanaReading": "アップル",
        "pronunciationHint": "Stress AP and use /æ/ at the start.",
        "exampleSentence": "This apple is green.",
        "exampleJapanese": "このりんごは緑色です。",
        "commonMistake": "Use “an apple,” not “a apple.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4818edc6b5101bab.svg",
          "kind": "single",
          "altEn": "An illustration of apple.",
          "altJa": "りんごのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "food-and-drink"
      },
      "icon": "",
      "tags": [
        "food-and-drink",
        "level-5",
        "apple"
      ]
    }
  },
  {
    "id": "word-l05-banana",
    "category": "words",
    "level": 5,
    "before_fields": {
      "title_en": "banana",
      "title_ja": "バナナ",
      "content": {
        "word": "banana",
        "japanese": "バナナ",
        "kanaReading": "バナナ",
        "pronunciationHint": "Stress the middle syllable: ba-NA-na.",
        "exampleSentence": "This banana is very sweet.",
        "exampleJapanese": "このバナナはとても甘いです。",
        "commonMistake": "Do not stress the first syllable.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "food-and-drink"
      },
      "icon": "🍌",
      "tags": [
        "food-and-drink",
        "level-5",
        "banana"
      ]
    },
    "after_fields": {
      "title_en": "banana",
      "title_ja": "バナナ",
      "content": {
        "word": "banana",
        "japanese": "バナナ",
        "kanaReading": "バナナ",
        "pronunciationHint": "Stress the middle syllable: ba-NA-na.",
        "exampleSentence": "This banana is very sweet.",
        "exampleJapanese": "このバナナはとても甘いです。",
        "commonMistake": "Do not stress the first syllable.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-458a6c2bbdf69a28.svg",
          "kind": "single",
          "altEn": "An illustration of banana.",
          "altJa": "バナナのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "food-and-drink"
      },
      "icon": "",
      "tags": [
        "food-and-drink",
        "level-5",
        "banana"
      ]
    }
  },
  {
    "id": "word-l05-chicken",
    "category": "words",
    "level": 5,
    "before_fields": {
      "title_en": "chicken",
      "title_ja": "鶏肉・にわとり",
      "content": {
        "word": "chicken",
        "japanese": "鶏肉・にわとり",
        "kanaReading": "チキン",
        "pronunciationHint": "Stress CHICK; the second vowel is weak.",
        "exampleSentence": "We had chicken for lunch.",
        "exampleJapanese": "昼食に鶏肉を食べました。",
        "commonMistake": "Use “chicken” without “a” when you mean the food.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "food-and-drink"
      },
      "icon": "🍗",
      "tags": [
        "food-and-drink",
        "level-5",
        "chicken"
      ]
    },
    "after_fields": {
      "title_en": "chicken",
      "title_ja": "鶏肉",
      "content": {
        "word": "chicken",
        "japanese": "鶏肉",
        "kanaReading": "チキン",
        "pronunciationHint": "Stress CHICK; the second vowel is weak.",
        "exampleSentence": "I like chicken and rice.",
        "exampleJapanese": "私は鶏肉とご飯が好きです。",
        "commonMistake": "The food is uncountable: “some chicken.” “A chicken” means one bird.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-29f04d408379cfdf.svg",
          "kind": "single",
          "altEn": "An illustration of chicken.",
          "altJa": "鶏肉のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "food-and-drink"
      },
      "icon": "",
      "tags": [
        "food-and-drink",
        "level-5",
        "chicken"
      ]
    }
  },
  {
    "id": "word-l05-fish",
    "category": "words",
    "level": 5,
    "before_fields": {
      "title_en": "fish",
      "title_ja": "魚",
      "content": {
        "word": "fish",
        "japanese": "魚",
        "kanaReading": "フィッシュ",
        "pronunciationHint": "Finish with the /ʃ/ sound.",
        "exampleSentence": "The fish is fresh today.",
        "exampleJapanese": "今日の魚は新鮮です。",
        "commonMistake": "The usual plural can be “fish,” not always “fishes.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "food-and-drink"
      },
      "icon": "🐟",
      "tags": [
        "food-and-drink",
        "level-5",
        "fish"
      ]
    },
    "after_fields": {
      "title_en": "fish",
      "title_ja": "魚",
      "content": {
        "word": "fish",
        "japanese": "魚",
        "kanaReading": "フィッシュ",
        "pronunciationHint": "Finish with the /ʃ/ sound.",
        "exampleSentence": "The fish is fresh today.",
        "exampleJapanese": "今日の魚は新鮮です。",
        "commonMistake": "The usual plural can be “fish,” not always “fishes.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-58d667e266b04071.svg",
          "kind": "single",
          "altEn": "An illustration of fish.",
          "altJa": "魚のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "food-and-drink"
      },
      "icon": "",
      "tags": [
        "food-and-drink",
        "level-5",
        "fish"
      ]
    }
  },
  {
    "id": "word-l05-soup",
    "category": "words",
    "level": 5,
    "before_fields": {
      "title_en": "soup",
      "title_ja": "スープ",
      "content": {
        "word": "soup",
        "japanese": "スープ",
        "kanaReading": "スープ",
        "pronunciationHint": "Hold the /uː/ vowel and finish with p.",
        "exampleSentence": "The soup smells wonderful.",
        "exampleJapanese": "そのスープはとてもいい香りです。",
        "commonMistake": "Do not add a vowel after the final p.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "food-and-drink"
      },
      "icon": "🥣",
      "tags": [
        "food-and-drink",
        "level-5",
        "soup"
      ]
    },
    "after_fields": {
      "title_en": "soup",
      "title_ja": "スープ",
      "content": {
        "word": "soup",
        "japanese": "スープ",
        "kanaReading": "スープ",
        "pronunciationHint": "Hold the /uː/ vowel and finish with p.",
        "exampleSentence": "The soup is hot.",
        "exampleJapanese": "スープは熱いです。",
        "commonMistake": "Do not add a vowel after the final p.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c69531dce2a56d39.svg",
          "kind": "single",
          "altEn": "An illustration of soup.",
          "altJa": "スープのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "food-and-drink"
      },
      "icon": "",
      "tags": [
        "food-and-drink",
        "level-5",
        "soup"
      ]
    }
  },
  {
    "id": "word-l06-house",
    "category": "words",
    "level": 6,
    "before_fields": {
      "title_en": "house",
      "title_ja": "家・住宅",
      "content": {
        "word": "house",
        "japanese": "家・住宅",
        "kanaReading": "ハウス",
        "pronunciationHint": "Glide through /aʊ/ and end with /s/.",
        "exampleSentence": "Their house has a small garden.",
        "exampleJapanese": "彼らの家には小さな庭があります。",
        "commonMistake": "Use “home” for the idea of where you live, not always “house.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "home"
      },
      "icon": "🏠",
      "tags": [
        "home",
        "level-6",
        "house"
      ]
    },
    "after_fields": {
      "title_en": "house",
      "title_ja": "家・住宅",
      "content": {
        "word": "house",
        "japanese": "家・住宅",
        "kanaReading": "ハウス",
        "pronunciationHint": "Glide through /aʊ/ and end with /s/.",
        "exampleSentence": "Our house is small.",
        "exampleJapanese": "私たちの家は小さいです。",
        "commonMistake": "Use “home” for the idea of where you live, not always “house.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f30037947a577512.svg",
          "kind": "single",
          "altEn": "An illustration of house.",
          "altJa": "家・住宅のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "home"
      },
      "icon": "",
      "tags": [
        "home",
        "level-6",
        "house"
      ]
    }
  },
  {
    "id": "word-l06-room",
    "category": "words",
    "level": 6,
    "before_fields": {
      "title_en": "room",
      "title_ja": "部屋",
      "content": {
        "word": "room",
        "japanese": "部屋",
        "kanaReading": "ルーム",
        "pronunciationHint": "Hold the long /uː/ sound.",
        "exampleSentence": "My room is upstairs.",
        "exampleJapanese": "私の部屋は2階です。",
        "commonMistake": "Say “in my room,” not “at my room.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "home"
      },
      "icon": "🚪",
      "tags": [
        "home",
        "level-6",
        "room"
      ]
    },
    "after_fields": {
      "title_en": "room",
      "title_ja": "部屋",
      "content": {
        "word": "room",
        "japanese": "部屋",
        "kanaReading": "ルーム",
        "pronunciationHint": "A long /uː/ is common. Some speakers use a shorter /ʊ/; follow the voice you are practising.",
        "exampleSentence": "My room is clean.",
        "exampleJapanese": "私の部屋はきれいです。",
        "commonMistake": "Say “in my room,” not “at my room.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-bc2c2ffa8343cee8.svg",
          "kind": "single",
          "altEn": "An illustration of room.",
          "altJa": "部屋のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "home"
      },
      "icon": "",
      "tags": [
        "home",
        "level-6",
        "room"
      ]
    }
  },
  {
    "id": "word-l06-kitchen",
    "category": "words",
    "level": 6,
    "before_fields": {
      "title_en": "kitchen",
      "title_ja": "台所・キッチン",
      "content": {
        "word": "kitchen",
        "japanese": "台所・キッチン",
        "kanaReading": "キッチン",
        "pronunciationHint": "Stress KITCH; the final vowel is weak.",
        "exampleSentence": "Dad is cooking in the kitchen.",
        "exampleJapanese": "父は台所で料理をしています。",
        "commonMistake": "Do not pronounce the t as a separate syllable.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "home"
      },
      "icon": "🍳",
      "tags": [
        "home",
        "level-6",
        "kitchen"
      ]
    },
    "after_fields": {
      "title_en": "kitchen",
      "title_ja": "台所・キッチン",
      "content": {
        "word": "kitchen",
        "japanese": "台所・キッチン",
        "kanaReading": "キッチン",
        "pronunciationHint": "Stress KITCH; the final vowel is weak.",
        "exampleSentence": "Dad is cooking in the kitchen.",
        "exampleJapanese": "父は台所で料理をしています。",
        "commonMistake": "Do not pronounce the t as a separate syllable.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-3d57f278eef72115.svg",
          "kind": "scene",
          "altEn": "A room with a cooker, sink, and fridge for preparing food.",
          "altJa": "コンロ・流し・冷蔵庫がある台所。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "home"
      },
      "icon": "",
      "tags": [
        "home",
        "level-6",
        "kitchen"
      ]
    }
  },
  {
    "id": "word-l06-bathroom",
    "category": "words",
    "level": 6,
    "before_fields": {
      "title_en": "bathroom",
      "title_ja": "浴室・トイレ",
      "content": {
        "word": "bathroom",
        "japanese": "浴室・トイレ",
        "kanaReading": "バスルーム",
        "pronunciationHint": "Use the unvoiced th /θ/ in “bath.”",
        "exampleSentence": "The bathroom is down the hall.",
        "exampleJapanese": "浴室は廊下の先です。",
        "commonMistake": "In US English, “bathroom” may also mean a toilet room.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "home"
      },
      "icon": "🛁",
      "tags": [
        "home",
        "level-6",
        "bathroom"
      ]
    },
    "after_fields": {
      "title_en": "bathroom",
      "title_ja": "浴室・トイレ",
      "content": {
        "word": "bathroom",
        "japanese": "浴室・トイレ",
        "kanaReading": "バスルーム",
        "pronunciationHint": "Use the unvoiced th /θ/ in “bath.”",
        "exampleSentence": "The bathroom is down the hall.",
        "exampleJapanese": "浴室は廊下の先です。",
        "commonMistake": "In US English, “bathroom” may also mean a toilet room.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-353bf0631ef86af4.svg",
          "kind": "scene",
          "altEn": "A bathroom with a bath, toilet, and washbasin.",
          "altJa": "浴槽・トイレ・洗面台がある浴室。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "home"
      },
      "icon": "",
      "tags": [
        "home",
        "level-6",
        "bathroom"
      ]
    }
  },
  {
    "id": "word-l06-bedroom",
    "category": "words",
    "level": 6,
    "before_fields": {
      "title_en": "bedroom",
      "title_ja": "寝室",
      "content": {
        "word": "bedroom",
        "japanese": "寝室",
        "kanaReading": "ベッドルーム",
        "pronunciationHint": "Stress BED and connect the two parts.",
        "exampleSentence": "The bedroom gets morning sun.",
        "exampleJapanese": "寝室には朝日が入ります。",
        "commonMistake": "Do not separate “bed” and “room” with a long pause.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "home"
      },
      "icon": "🛏️",
      "tags": [
        "home",
        "level-6",
        "bedroom"
      ]
    },
    "after_fields": {
      "title_en": "bedroom",
      "title_ja": "寝室",
      "content": {
        "word": "bedroom",
        "japanese": "寝室",
        "kanaReading": "ベッドルーム",
        "pronunciationHint": "Stress BED and connect the two parts.",
        "exampleSentence": "This is my bedroom.",
        "exampleJapanese": "ここは私の寝室です。",
        "commonMistake": "Do not separate “bed” and “room” with a long pause.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-0bb6a5cf05b33e42.svg",
          "kind": "scene",
          "altEn": "A bed and a bedside lamp in a room with a window.",
          "altJa": "窓のある寝室にベッドとランプがあります。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "home"
      },
      "icon": "",
      "tags": [
        "home",
        "level-6",
        "bedroom"
      ]
    }
  },
  {
    "id": "word-l06-bed",
    "category": "words",
    "level": 6,
    "before_fields": {
      "title_en": "bed",
      "title_ja": "ベッド",
      "content": {
        "word": "bed",
        "japanese": "ベッド",
        "kanaReading": "ベッド",
        "pronunciationHint": "Use short /e/ and keep the final d.",
        "exampleSentence": "I went to bed early.",
        "exampleJapanese": "私は早く寝ました。",
        "commonMistake": "Say “go to bed” without “the” for sleeping.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "home"
      },
      "icon": "🛏️",
      "tags": [
        "home",
        "level-6",
        "bed"
      ]
    },
    "after_fields": {
      "title_en": "bed",
      "title_ja": "ベッド",
      "content": {
        "word": "bed",
        "japanese": "ベッド",
        "kanaReading": "ベッド",
        "pronunciationHint": "Use short /e/ and keep the final d.",
        "exampleSentence": "My bed is next to the window.",
        "exampleJapanese": "私のベッドは窓の隣にあります。",
        "commonMistake": "Say “go to bed” without “the” for sleeping.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-decbc7989f625a55.svg",
          "kind": "single",
          "altEn": "An illustration of bed.",
          "altJa": "ベッドのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "home"
      },
      "icon": "",
      "tags": [
        "home",
        "level-6",
        "bed"
      ]
    }
  },
  {
    "id": "word-l06-table",
    "category": "words",
    "level": 6,
    "before_fields": {
      "title_en": "table",
      "title_ja": "テーブル",
      "content": {
        "word": "table",
        "japanese": "テーブル",
        "kanaReading": "テイブル",
        "pronunciationHint": "Stress TAY; the second syllable is weak.",
        "exampleSentence": "Dinner is on the table.",
        "exampleJapanese": "夕食はテーブルの上です。",
        "commonMistake": "Do not pronounce the final e.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "home"
      },
      "icon": "🪵",
      "tags": [
        "home",
        "level-6",
        "table"
      ]
    },
    "after_fields": {
      "title_en": "table",
      "title_ja": "テーブル",
      "content": {
        "word": "table",
        "japanese": "テーブル",
        "kanaReading": "テイブル",
        "pronunciationHint": "Stress TAY; the second syllable is weak.",
        "exampleSentence": "Dinner is on the table.",
        "exampleJapanese": "夕食はテーブルの上です。",
        "commonMistake": "Do not pronounce the final e.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-3abb4eae748bdc67.svg",
          "kind": "single",
          "altEn": "An illustration of table.",
          "altJa": "テーブルのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "home"
      },
      "icon": "",
      "tags": [
        "home",
        "level-6",
        "table"
      ]
    }
  },
  {
    "id": "word-l06-lamp",
    "category": "words",
    "level": 6,
    "before_fields": {
      "title_en": "lamp",
      "title_ja": "ランプ",
      "content": {
        "word": "lamp",
        "japanese": "ランプ",
        "kanaReading": "ランプ",
        "pronunciationHint": "Use /æ/ and close both lips for final p.",
        "exampleSentence": "Turn off the lamp before bed.",
        "exampleJapanese": "寝る前にランプを消してください。",
        "commonMistake": "Do not drop the final p.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "home"
      },
      "icon": "💡",
      "tags": [
        "home",
        "level-6",
        "lamp"
      ]
    },
    "after_fields": {
      "title_en": "lamp",
      "title_ja": "ランプ",
      "content": {
        "word": "lamp",
        "japanese": "ランプ",
        "kanaReading": "ランプ",
        "pronunciationHint": "Use /æ/ and close both lips for final p.",
        "exampleSentence": "Turn off the lamp before bed.",
        "exampleJapanese": "寝る前にランプを消してください。",
        "commonMistake": "Do not drop the final p.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b281303e881d1d31.svg",
          "kind": "single",
          "altEn": "An illustration of lamp.",
          "altJa": "ランプのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "home"
      },
      "icon": "",
      "tags": [
        "home",
        "level-6",
        "lamp"
      ]
    }
  },
  {
    "id": "word-l06-key",
    "category": "words",
    "level": 6,
    "before_fields": {
      "title_en": "key",
      "title_ja": "鍵",
      "content": {
        "word": "key",
        "japanese": "鍵",
        "kanaReading": "キー",
        "pronunciationHint": "Use a long /iː/ vowel.",
        "exampleSentence": "I cannot find my key.",
        "exampleJapanese": "鍵が見つかりません。",
        "commonMistake": "“Key” and “quay” can sound the same, but meanings differ.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "home"
      },
      "icon": "🔑",
      "tags": [
        "home",
        "level-6",
        "key"
      ]
    },
    "after_fields": {
      "title_en": "key",
      "title_ja": "鍵",
      "content": {
        "word": "key",
        "japanese": "鍵",
        "kanaReading": "キー",
        "pronunciationHint": "Use a long /iː/ vowel.",
        "exampleSentence": "I cannot find my key.",
        "exampleJapanese": "鍵が見つかりません。",
        "commonMistake": "A key opens a lock. Use “my key” for one, and “my keys” for several.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-46c739b6373b614e.svg",
          "kind": "single",
          "altEn": "An illustration of key.",
          "altJa": "鍵のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "home"
      },
      "icon": "",
      "tags": [
        "home",
        "level-6",
        "key"
      ]
    }
  },
  {
    "id": "word-l06-clock",
    "category": "words",
    "level": 6,
    "before_fields": {
      "title_en": "clock",
      "title_ja": "時計",
      "content": {
        "word": "clock",
        "japanese": "時計",
        "kanaReading": "クロック",
        "pronunciationHint": "Blend /k/ and /l/ and use a short vowel.",
        "exampleSentence": "The clock is five minutes fast.",
        "exampleJapanese": "その時計は5分進んでいます。",
        "commonMistake": "Use “watch” for one worn on the wrist.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "home"
      },
      "icon": "🕰️",
      "tags": [
        "home",
        "level-6",
        "clock"
      ]
    },
    "after_fields": {
      "title_en": "clock",
      "title_ja": "時計",
      "content": {
        "word": "clock",
        "japanese": "時計",
        "kanaReading": "クロック",
        "pronunciationHint": "Blend /k/ and /l/ and use a short vowel.",
        "exampleSentence": "The clock is on the wall.",
        "exampleJapanese": "時計は壁にあります。",
        "commonMistake": "Use “watch” for one worn on the wrist.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d5b6e1f50f140ae8.svg",
          "kind": "single",
          "altEn": "An illustration of clock.",
          "altJa": "時計のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "home"
      },
      "icon": "",
      "tags": [
        "home",
        "level-6",
        "clock"
      ]
    }
  },
  {
    "id": "word-l07-dog",
    "category": "words",
    "level": 7,
    "before_fields": {
      "title_en": "dog",
      "title_ja": "犬",
      "content": {
        "word": "dog",
        "japanese": "犬",
        "kanaReading": "ドッグ",
        "pronunciationHint": "Use an open vowel and finish with a voiced g.",
        "exampleSentence": "Our dog loves the park.",
        "exampleJapanese": "うちの犬は公園が大好きです。",
        "commonMistake": "Do not add a vowel after the final g.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "animals"
      },
      "icon": "🐕",
      "tags": [
        "animals",
        "level-7",
        "dog"
      ]
    },
    "after_fields": {
      "title_en": "dog",
      "title_ja": "犬",
      "content": {
        "word": "dog",
        "japanese": "犬",
        "kanaReading": "ドッグ",
        "pronunciationHint": "Use an open vowel and finish with a voiced g.",
        "exampleSentence": "Our dog loves the park.",
        "exampleJapanese": "うちの犬は公園が大好きです。",
        "commonMistake": "Do not add a vowel after the final g.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-10b9d974cea07ac9.svg",
          "kind": "single",
          "altEn": "An illustration of dog.",
          "altJa": "犬のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "animals"
      },
      "icon": "",
      "tags": [
        "animals",
        "level-7",
        "dog"
      ]
    }
  },
  {
    "id": "word-l07-cat",
    "category": "words",
    "level": 7,
    "before_fields": {
      "title_en": "cat",
      "title_ja": "猫",
      "content": {
        "word": "cat",
        "japanese": "猫",
        "kanaReading": "キャット",
        "pronunciationHint": "Use the open /æ/ vowel and a crisp final t.",
        "exampleSentence": "The cat is under the sofa.",
        "exampleJapanese": "猫はソファの下にいます。",
        "commonMistake": "Do not pronounce it like “cut.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "animals"
      },
      "icon": "🐈",
      "tags": [
        "animals",
        "level-7",
        "cat"
      ]
    },
    "after_fields": {
      "title_en": "cat",
      "title_ja": "猫",
      "content": {
        "word": "cat",
        "japanese": "猫",
        "kanaReading": "キャット",
        "pronunciationHint": "Use the open /æ/ vowel and a crisp final t.",
        "exampleSentence": "The cat is under the sofa.",
        "exampleJapanese": "猫はソファの下にいます。",
        "commonMistake": "Do not pronounce it like “cut.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-dc514a7b321c5568.svg",
          "kind": "single",
          "altEn": "An illustration of cat.",
          "altJa": "猫のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "animals"
      },
      "icon": "",
      "tags": [
        "animals",
        "level-7",
        "cat"
      ]
    }
  },
  {
    "id": "word-l07-bird",
    "category": "words",
    "level": 7,
    "before_fields": {
      "title_en": "bird",
      "title_ja": "鳥",
      "content": {
        "word": "bird",
        "japanese": "鳥",
        "kanaReading": "バード",
        "pronunciationHint": "Hold the r-colored vowel in US English.",
        "exampleSentence": "A bird is singing outside.",
        "exampleJapanese": "外で鳥が鳴いています。",
        "commonMistake": "Do not add a vowel after the final d.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "animals"
      },
      "icon": "🐦",
      "tags": [
        "animals",
        "level-7",
        "bird"
      ]
    },
    "after_fields": {
      "title_en": "bird",
      "title_ja": "鳥",
      "content": {
        "word": "bird",
        "japanese": "鳥",
        "kanaReading": "バード",
        "pronunciationHint": "Hold the r-colored vowel in US English.",
        "exampleSentence": "A bird is singing outside.",
        "exampleJapanese": "外で鳥が鳴いています。",
        "commonMistake": "Do not add a vowel after the final d.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c5e638aab8705736.svg",
          "kind": "single",
          "altEn": "An illustration of bird.",
          "altJa": "鳥のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "animals"
      },
      "icon": "",
      "tags": [
        "animals",
        "level-7",
        "bird"
      ]
    }
  },
  {
    "id": "word-l07-rabbit",
    "category": "words",
    "level": 7,
    "before_fields": {
      "title_en": "rabbit",
      "title_ja": "うさぎ",
      "content": {
        "word": "rabbit",
        "japanese": "うさぎ",
        "kanaReading": "ラビット",
        "pronunciationHint": "Stress RAB; the second vowel is weak.",
        "exampleSentence": "The rabbit has long ears.",
        "exampleJapanese": "そのうさぎは耳が長いです。",
        "commonMistake": "Do not double the spoken b just because spelling has two.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "animals"
      },
      "icon": "🐇",
      "tags": [
        "animals",
        "level-7",
        "rabbit"
      ]
    },
    "after_fields": {
      "title_en": "rabbit",
      "title_ja": "うさぎ",
      "content": {
        "word": "rabbit",
        "japanese": "うさぎ",
        "kanaReading": "ラビット",
        "pronunciationHint": "Stress RAB; the second vowel is weak.",
        "exampleSentence": "The rabbit has long ears.",
        "exampleJapanese": "そのうさぎは耳が長いです。",
        "commonMistake": "Do not double the spoken b just because spelling has two.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c088c68b0dcb10d6.svg",
          "kind": "single",
          "altEn": "An illustration of rabbit.",
          "altJa": "うさぎのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "animals"
      },
      "icon": "",
      "tags": [
        "animals",
        "level-7",
        "rabbit"
      ]
    }
  },
  {
    "id": "word-l07-horse",
    "category": "words",
    "level": 7,
    "before_fields": {
      "title_en": "horse",
      "title_ja": "馬",
      "content": {
        "word": "horse",
        "japanese": "馬",
        "kanaReading": "ホース",
        "pronunciationHint": "Keep the h and finish with /s/.",
        "exampleSentence": "The horse ran across the field.",
        "exampleJapanese": "馬は野原を走りました。",
        "commonMistake": "Do not confuse it with “hose”: the vowel and final sound differ, and UK English may not pronounce the r in “horse.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "animals"
      },
      "icon": "🐎",
      "tags": [
        "animals",
        "level-7",
        "horse"
      ]
    },
    "after_fields": {
      "title_en": "horse",
      "title_ja": "馬",
      "content": {
        "word": "horse",
        "japanese": "馬",
        "kanaReading": "ホース",
        "pronunciationHint": "Keep the h and finish with /s/.",
        "exampleSentence": "The horse can run fast.",
        "exampleJapanese": "馬は速く走れます。",
        "commonMistake": "Do not confuse it with “hose”: the vowel and final sound differ, and UK English may not pronounce the r in “horse.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ac8c375cf4e3ff37.svg",
          "kind": "single",
          "altEn": "An illustration of horse.",
          "altJa": "馬のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "animals"
      },
      "icon": "",
      "tags": [
        "animals",
        "level-7",
        "horse"
      ]
    }
  },
  {
    "id": "word-l07-cow",
    "category": "words",
    "level": 7,
    "before_fields": {
      "title_en": "cow",
      "title_ja": "牛",
      "content": {
        "word": "cow",
        "japanese": "牛",
        "kanaReading": "カウ",
        "pronunciationHint": "Use one smooth /aʊ/ glide.",
        "exampleSentence": "The cow is eating grass.",
        "exampleJapanese": "牛は草を食べています。",
        "commonMistake": "Do not stretch it into two syllables.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "animals"
      },
      "icon": "🐄",
      "tags": [
        "animals",
        "level-7",
        "cow"
      ]
    },
    "after_fields": {
      "title_en": "cow",
      "title_ja": "牛",
      "content": {
        "word": "cow",
        "japanese": "牛",
        "kanaReading": "カウ",
        "pronunciationHint": "Use one smooth /aʊ/ glide.",
        "exampleSentence": "The cow is eating grass.",
        "exampleJapanese": "牛は草を食べています。",
        "commonMistake": "Do not stretch it into two syllables.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c112cdf68ee6b511.svg",
          "kind": "single",
          "altEn": "An illustration of cow.",
          "altJa": "牛のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "animals"
      },
      "icon": "",
      "tags": [
        "animals",
        "level-7",
        "cow"
      ]
    }
  },
  {
    "id": "word-l07-sheep",
    "category": "words",
    "level": 7,
    "before_fields": {
      "title_en": "sheep",
      "title_ja": "羊",
      "content": {
        "word": "sheep",
        "japanese": "羊",
        "kanaReading": "シープ",
        "pronunciationHint": "Use /ʃ/ and a long /iː/.",
        "exampleSentence": "Three sheep are near the fence.",
        "exampleJapanese": "3匹の羊が柵のそばにいます。",
        "commonMistake": "The plural is “sheep,” not “sheeps.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "animals"
      },
      "icon": "🐑",
      "tags": [
        "animals",
        "level-7",
        "sheep"
      ]
    },
    "after_fields": {
      "title_en": "sheep",
      "title_ja": "羊",
      "content": {
        "word": "sheep",
        "japanese": "羊",
        "kanaReading": "シープ",
        "pronunciationHint": "Use /ʃ/ and a long /iː/.",
        "exampleSentence": "Three sheep are near the fence.",
        "exampleJapanese": "3匹の羊が柵のそばにいます。",
        "commonMistake": "The plural is “sheep,” not “sheeps.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-551279e6bb83e085.svg",
          "kind": "single",
          "altEn": "An illustration of sheep.",
          "altJa": "羊のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "animals"
      },
      "icon": "",
      "tags": [
        "animals",
        "level-7",
        "sheep"
      ]
    }
  },
  {
    "id": "word-l07-pig",
    "category": "words",
    "level": 7,
    "before_fields": {
      "title_en": "pig",
      "title_ja": "豚",
      "content": {
        "word": "pig",
        "japanese": "豚",
        "kanaReading": "ピッグ",
        "pronunciationHint": "Use a short /ɪ/ and final voiced g.",
        "exampleSentence": "The pig rolled in the mud.",
        "exampleJapanese": "豚は泥の中を転がりました。",
        "commonMistake": "Do not pronounce it like “peak.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "animals"
      },
      "icon": "🐖",
      "tags": [
        "animals",
        "level-7",
        "pig"
      ]
    },
    "after_fields": {
      "title_en": "pig",
      "title_ja": "豚",
      "content": {
        "word": "pig",
        "japanese": "豚",
        "kanaReading": "ピッグ",
        "pronunciationHint": "Use a short /ɪ/ and final voiced g.",
        "exampleSentence": "The pig is pink.",
        "exampleJapanese": "豚はピンク色です。",
        "commonMistake": "Do not pronounce it like “peak.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f163782c4b864c7e.svg",
          "kind": "single",
          "altEn": "An illustration of pig.",
          "altJa": "豚のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "animals"
      },
      "icon": "",
      "tags": [
        "animals",
        "level-7",
        "pig"
      ]
    }
  },
  {
    "id": "word-l07-lion",
    "category": "words",
    "level": 7,
    "before_fields": {
      "title_en": "lion",
      "title_ja": "ライオン",
      "content": {
        "word": "lion",
        "japanese": "ライオン",
        "kanaReading": "ライオン",
        "pronunciationHint": "Stress LI and make the ending two light sounds.",
        "exampleSentence": "The lion rested in the shade.",
        "exampleJapanese": "ライオンは日陰で休みました。",
        "commonMistake": "Do not pronounce it as only one syllable.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "animals"
      },
      "icon": "🦁",
      "tags": [
        "animals",
        "level-7",
        "lion"
      ]
    },
    "after_fields": {
      "title_en": "lion",
      "title_ja": "ライオン",
      "content": {
        "word": "lion",
        "japanese": "ライオン",
        "kanaReading": "ライオン",
        "pronunciationHint": "Stress the first syllable: LI-on. Let the second syllable stay light.",
        "exampleSentence": "The lion is big.",
        "exampleJapanese": "ライオンは大きいです。",
        "commonMistake": "Do not pronounce it as only one syllable.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-02ea1c4701a782c1.svg",
          "kind": "single",
          "altEn": "An illustration of lion.",
          "altJa": "ライオンのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "animals"
      },
      "icon": "",
      "tags": [
        "animals",
        "level-7",
        "lion"
      ]
    }
  },
  {
    "id": "word-l07-elephant",
    "category": "words",
    "level": 7,
    "before_fields": {
      "title_en": "elephant",
      "title_ja": "象",
      "content": {
        "word": "elephant",
        "japanese": "象",
        "kanaReading": "エレファント",
        "pronunciationHint": "Stress EL; keep the other syllables lighter.",
        "exampleSentence": "An elephant can use its trunk like a hand.",
        "exampleJapanese": "象は鼻を手のように使えます。",
        "commonMistake": "Do not stress the final syllable.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "animals"
      },
      "icon": "🐘",
      "tags": [
        "animals",
        "level-7",
        "elephant"
      ]
    },
    "after_fields": {
      "title_en": "elephant",
      "title_ja": "象",
      "content": {
        "word": "elephant",
        "japanese": "象",
        "kanaReading": "エレファント",
        "pronunciationHint": "Stress EL; keep the other syllables lighter.",
        "exampleSentence": "The elephant has big ears.",
        "exampleJapanese": "象は耳が大きいです。",
        "commonMistake": "Do not stress the final syllable.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-8099c664a607cd97.svg",
          "kind": "single",
          "altEn": "An illustration of elephant.",
          "altJa": "象のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "animals"
      },
      "icon": "",
      "tags": [
        "animals",
        "level-7",
        "elephant"
      ]
    }
  },
  {
    "id": "word-l08-run",
    "category": "words",
    "level": 8,
    "before_fields": {
      "title_en": "run",
      "title_ja": "走る",
      "content": {
        "word": "run",
        "japanese": "走る",
        "kanaReading": "ラン",
        "pronunciationHint": "Use the short /ʌ/ vowel.",
        "exampleSentence": "I run around the park each morning.",
        "exampleJapanese": "私は毎朝公園を走ります。",
        "commonMistake": "The past form is “ran,” not “runned.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "basic-actions"
      },
      "icon": "🏃",
      "tags": [
        "basic-actions",
        "level-8",
        "run"
      ]
    },
    "after_fields": {
      "title_en": "run",
      "title_ja": "走る",
      "content": {
        "word": "run",
        "japanese": "走る",
        "kanaReading": "ラン",
        "pronunciationHint": "Use the short /ʌ/ vowel.",
        "exampleSentence": "I can run fast.",
        "exampleJapanese": "私は速く走れます。",
        "commonMistake": "The past form is “ran,” not “runned.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-973cdd3350ab2233.svg",
          "kind": "single",
          "altEn": "An illustration of run.",
          "altJa": "走るのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "basic-actions"
      },
      "icon": "",
      "tags": [
        "basic-actions",
        "level-8",
        "run"
      ]
    }
  },
  {
    "id": "word-l08-walk",
    "category": "words",
    "level": 8,
    "before_fields": {
      "title_en": "walk",
      "title_ja": "歩く",
      "content": {
        "word": "walk",
        "japanese": "歩く",
        "kanaReading": "ウォーク",
        "pronunciationHint": "The l is silent; use a broad vowel.",
        "exampleSentence": "We walk to school together.",
        "exampleJapanese": "私たちは一緒に歩いて学校へ行きます。",
        "commonMistake": "Do not pronounce the written l.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "basic-actions"
      },
      "icon": "🚶",
      "tags": [
        "basic-actions",
        "level-8",
        "walk"
      ]
    },
    "after_fields": {
      "title_en": "walk",
      "title_ja": "歩く",
      "content": {
        "word": "walk",
        "japanese": "歩く",
        "kanaReading": "ウォーク",
        "pronunciationHint": "The l is silent; use a broad vowel.",
        "exampleSentence": "We walk to school together.",
        "exampleJapanese": "私たちは一緒に歩いて学校へ行きます。",
        "commonMistake": "Do not pronounce the written l.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-e98fbb529d6a80d2.svg",
          "kind": "single",
          "altEn": "An illustration of walk.",
          "altJa": "歩くのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "basic-actions"
      },
      "icon": "",
      "tags": [
        "basic-actions",
        "level-8",
        "walk"
      ]
    }
  },
  {
    "id": "word-l08-jump",
    "category": "words",
    "level": 8,
    "before_fields": {
      "title_en": "jump",
      "title_ja": "跳ぶ",
      "content": {
        "word": "jump",
        "japanese": "跳ぶ",
        "kanaReading": "ジャンプ",
        "pronunciationHint": "Finish with the /mp/ cluster.",
        "exampleSentence": "Can you jump over this line?",
        "exampleJapanese": "この線を跳び越えられますか。",
        "commonMistake": "Do not add a vowel after p.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "basic-actions"
      },
      "icon": "🤸",
      "tags": [
        "basic-actions",
        "level-8",
        "jump"
      ]
    },
    "after_fields": {
      "title_en": "jump",
      "title_ja": "跳ぶ",
      "content": {
        "word": "jump",
        "japanese": "跳ぶ",
        "kanaReading": "ジャンプ",
        "pronunciationHint": "Finish with the /mp/ cluster.",
        "exampleSentence": "Can you jump over this line?",
        "exampleJapanese": "この線を跳び越えられますか。",
        "commonMistake": "Do not add a vowel after p.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-71b805d8e9ee75e1.svg",
          "kind": "single",
          "altEn": "An illustration of jump.",
          "altJa": "跳ぶのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "basic-actions"
      },
      "icon": "",
      "tags": [
        "basic-actions",
        "level-8",
        "jump"
      ]
    }
  },
  {
    "id": "word-l08-sit",
    "category": "words",
    "level": 8,
    "before_fields": {
      "title_en": "sit",
      "title_ja": "座る",
      "content": {
        "word": "sit",
        "japanese": "座る",
        "kanaReading": "シット",
        "pronunciationHint": "Use short /ɪ/ and a final t.",
        "exampleSentence": "Please sit next to me.",
        "exampleJapanese": "私の隣に座ってください。",
        "commonMistake": "“Sit” is intransitive; do not use it as “seat someone.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "basic-actions"
      },
      "icon": "🧘",
      "tags": [
        "basic-actions",
        "level-8",
        "sit"
      ]
    },
    "after_fields": {
      "title_en": "sit",
      "title_ja": "座る",
      "content": {
        "word": "sit",
        "japanese": "座る",
        "kanaReading": "シット",
        "pronunciationHint": "Use short /ɪ/ and a final t.",
        "exampleSentence": "Please sit next to me.",
        "exampleJapanese": "私の隣に座ってください。",
        "commonMistake": "Say “sit on a chair” or “sit down.” “Seat” is a different verb: “Please seat the guests.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-48a6c316975b3b2b.svg",
          "kind": "single",
          "altEn": "An illustration of sit.",
          "altJa": "座るのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "basic-actions"
      },
      "icon": "",
      "tags": [
        "basic-actions",
        "level-8",
        "sit"
      ]
    }
  },
  {
    "id": "word-l08-stand",
    "category": "words",
    "level": 8,
    "before_fields": {
      "title_en": "stand",
      "title_ja": "立つ",
      "content": {
        "word": "stand",
        "japanese": "立つ",
        "kanaReading": "スタンド",
        "pronunciationHint": "Blend /st/ and keep the final d.",
        "exampleSentence": "Stand near the yellow sign.",
        "exampleJapanese": "黄色い標識の近くに立ってください。",
        "commonMistake": "“Stand up” is natural when focusing on the movement; “stand” alone can describe the position or give a concise instruction.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "basic-actions"
      },
      "icon": "🧍",
      "tags": [
        "basic-actions",
        "level-8",
        "stand"
      ]
    },
    "after_fields": {
      "title_en": "stand",
      "title_ja": "立つ",
      "content": {
        "word": "stand",
        "japanese": "立つ",
        "kanaReading": "スタンド",
        "pronunciationHint": "Blend /st/ and keep the final d.",
        "exampleSentence": "Please stand up.",
        "exampleJapanese": "立ってください。",
        "commonMistake": "“Stand up” is natural when focusing on the movement; “stand” alone can describe the position or give a concise instruction.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ea93ce7aa5961e9a.svg",
          "kind": "single",
          "altEn": "An illustration of stand.",
          "altJa": "立つのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "basic-actions"
      },
      "icon": "",
      "tags": [
        "basic-actions",
        "level-8",
        "stand"
      ]
    }
  },
  {
    "id": "word-l08-open",
    "category": "words",
    "level": 8,
    "before_fields": {
      "title_en": "open",
      "title_ja": "開ける・開いている",
      "content": {
        "word": "open",
        "japanese": "開ける・開いている",
        "kanaReading": "オウプン",
        "pronunciationHint": "Stress O; the second vowel is weak.",
        "exampleSentence": "Open the box carefully.",
        "exampleJapanese": "箱を注意して開けてください。",
        "commonMistake": "Do not use “open” where “turn on” is needed for a device.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "basic-actions"
      },
      "icon": "📂",
      "tags": [
        "basic-actions",
        "level-8",
        "open"
      ]
    },
    "after_fields": {
      "title_en": "open",
      "title_ja": "開ける",
      "content": {
        "word": "open",
        "japanese": "開ける",
        "kanaReading": "オウプン",
        "pronunciationHint": "Stress O; the second vowel is weak.",
        "exampleSentence": "Open your book, please.",
        "exampleJapanese": "本を開いてください。",
        "commonMistake": "Do not use “open” where “turn on” is needed for a device.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f36dc0c02697ac03.svg",
          "kind": "single",
          "altEn": "An illustration of open.",
          "altJa": "開けるのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "basic-actions"
      },
      "icon": "",
      "tags": [
        "basic-actions",
        "level-8",
        "open"
      ]
    }
  },
  {
    "id": "word-l08-close",
    "category": "words",
    "level": 8,
    "before_fields": {
      "title_en": "close",
      "title_ja": "閉める・近い",
      "content": {
        "word": "close",
        "japanese": "閉める・近い",
        "kanaReading": "クロウズ",
        "pronunciationHint": "As a verb, finish with voiced /z/.",
        "exampleSentence": "Close the gate behind you.",
        "exampleJapanese": "後ろの門を閉めてください。",
        "commonMistake": "The adjective “close” meaning near ends with /s/.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "basic-actions"
      },
      "icon": "🔒",
      "tags": [
        "basic-actions",
        "level-8",
        "close"
      ]
    },
    "after_fields": {
      "title_en": "close",
      "title_ja": "閉める",
      "content": {
        "word": "close",
        "japanese": "閉める",
        "kanaReading": "クロウズ",
        "pronunciationHint": "As a verb, finish with voiced /z/.",
        "exampleSentence": "Close the door, please.",
        "exampleJapanese": "ドアを閉めてください。",
        "commonMistake": "The adjective “close” meaning near ends with /s/.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5bbbc8748aa3abd1.svg",
          "kind": "single",
          "altEn": "An illustration of close.",
          "altJa": "閉めるのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "basic-actions"
      },
      "icon": "",
      "tags": [
        "basic-actions",
        "level-8",
        "close"
      ]
    }
  },
  {
    "id": "word-l08-read",
    "category": "words",
    "level": 8,
    "before_fields": {
      "title_en": "read",
      "title_ja": "読む",
      "content": {
        "word": "read",
        "japanese": "読む",
        "kanaReading": "リード",
        "pronunciationHint": "The present form rhymes with “need.”",
        "exampleSentence": "I read one page every night.",
        "exampleJapanese": "私は毎晩1ページ読みます。",
        "commonMistake": "The past spelling is the same but is pronounced “red.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "basic-actions"
      },
      "icon": "📖",
      "tags": [
        "basic-actions",
        "level-8",
        "read"
      ]
    },
    "after_fields": {
      "title_en": "read",
      "title_ja": "読む",
      "content": {
        "word": "read",
        "japanese": "読む",
        "kanaReading": "リード",
        "pronunciationHint": "The present form rhymes with “need.”",
        "exampleSentence": "I read one page every night.",
        "exampleJapanese": "私は毎晩1ページ読みます。",
        "commonMistake": "The past spelling is the same but is pronounced “red.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-eed385e02caf01bb.svg",
          "kind": "single",
          "altEn": "An illustration of read.",
          "altJa": "読むのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "basic-actions"
      },
      "icon": "",
      "tags": [
        "basic-actions",
        "level-8",
        "read"
      ]
    }
  },
  {
    "id": "word-l08-write",
    "category": "words",
    "level": 8,
    "before_fields": {
      "title_en": "write",
      "title_ja": "書く",
      "content": {
        "word": "write",
        "japanese": "書く",
        "kanaReading": "ライト",
        "pronunciationHint": "The initial w is silent.",
        "exampleSentence": "Write your name at the top.",
        "exampleJapanese": "上に名前を書いてください。",
        "commonMistake": "Do not pronounce the initial w.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "basic-actions"
      },
      "icon": "✍️",
      "tags": [
        "basic-actions",
        "level-8",
        "write"
      ]
    },
    "after_fields": {
      "title_en": "write",
      "title_ja": "書く",
      "content": {
        "word": "write",
        "japanese": "書く",
        "kanaReading": "ライト",
        "pronunciationHint": "The initial w is silent.",
        "exampleSentence": "Write your name at the top.",
        "exampleJapanese": "上に名前を書いてください。",
        "commonMistake": "Do not pronounce the initial w.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-61af359283c319ba.svg",
          "kind": "single",
          "altEn": "An illustration of write.",
          "altJa": "書くのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "basic-actions"
      },
      "icon": "",
      "tags": [
        "basic-actions",
        "level-8",
        "write"
      ]
    }
  },
  {
    "id": "word-l08-listen",
    "category": "words",
    "level": 8,
    "before_fields": {
      "title_en": "listen",
      "title_ja": "聞く・耳を傾ける",
      "content": {
        "word": "listen",
        "japanese": "聞く・耳を傾ける",
        "kanaReading": "リスン",
        "pronunciationHint": "The t is silent.",
        "exampleSentence": "Listen to the whole sentence.",
        "exampleJapanese": "文全体を聞いてください。",
        "commonMistake": "Use “listen to,” not “listen music.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "basic-actions"
      },
      "icon": "🎧",
      "tags": [
        "basic-actions",
        "level-8",
        "listen"
      ]
    },
    "after_fields": {
      "title_en": "listen",
      "title_ja": "聞く・耳を傾ける",
      "content": {
        "word": "listen",
        "japanese": "聞く・耳を傾ける",
        "kanaReading": "リスン",
        "pronunciationHint": "The t is silent.",
        "exampleSentence": "Listen to the teacher.",
        "exampleJapanese": "先生の話を聞いてください。",
        "commonMistake": "Use “listen to,” not “listen music.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-00f0b6b6cfda5ac4.svg",
          "kind": "single",
          "altEn": "An illustration of listen.",
          "altJa": "聞く・耳を傾けるのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "basic-actions"
      },
      "icon": "",
      "tags": [
        "basic-actions",
        "level-8",
        "listen"
      ]
    }
  },
  {
    "id": "word-l09-happy",
    "category": "words",
    "level": 9,
    "before_fields": {
      "title_en": "happy",
      "title_ja": "うれしい・幸せな",
      "content": {
        "word": "happy",
        "japanese": "うれしい・幸せな",
        "kanaReading": "ハッピー",
        "pronunciationHint": "Stress HAP and use /æ/.",
        "exampleSentence": "I feel happy when we cook together.",
        "exampleJapanese": "一緒に料理をすると私はうれしいです。",
        "commonMistake": "Say “I am happy,” not “I happy.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "feelings-and-needs"
      },
      "icon": "😊",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "happy"
      ]
    },
    "after_fields": {
      "title_en": "happy",
      "title_ja": "うれしい・幸せな",
      "content": {
        "word": "happy",
        "japanese": "うれしい・幸せな",
        "kanaReading": "ハッピー",
        "pronunciationHint": "Stress HAP and use /æ/.",
        "exampleSentence": "I feel happy when we cook together.",
        "exampleJapanese": "一緒に料理をすると私はうれしいです。",
        "commonMistake": "Say “I am happy,” not “I happy.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-910967cff49736d5.svg",
          "kind": "single",
          "altEn": "An illustration of happy.",
          "altJa": "うれしい・幸せなのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "feelings-and-needs"
      },
      "icon": "",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "happy"
      ]
    }
  },
  {
    "id": "word-l09-sad",
    "category": "words",
    "level": 9,
    "before_fields": {
      "title_en": "sad",
      "title_ja": "悲しい",
      "content": {
        "word": "sad",
        "japanese": "悲しい",
        "kanaReading": "サッド",
        "pronunciationHint": "Use the open /æ/ vowel.",
        "exampleSentence": "She felt sad after the movie.",
        "exampleJapanese": "彼女は映画の後で悲しくなりました。",
        "commonMistake": "Use “feel sad,” not “feel sadly,” for your condition.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "feelings-and-needs"
      },
      "icon": "😢",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "sad"
      ]
    },
    "after_fields": {
      "title_en": "sad",
      "title_ja": "悲しい",
      "content": {
        "word": "sad",
        "japanese": "悲しい",
        "kanaReading": "サッド",
        "pronunciationHint": "Use the open /æ/ vowel.",
        "exampleSentence": "She felt sad after the movie.",
        "exampleJapanese": "彼女は映画の後で悲しくなりました。",
        "commonMistake": "Use “feel sad,” not “feel sadly,” for your condition.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-536a139b525dd852.svg",
          "kind": "single",
          "altEn": "An illustration of sad.",
          "altJa": "悲しいのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "feelings-and-needs"
      },
      "icon": "",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "sad"
      ]
    }
  },
  {
    "id": "word-l09-tired",
    "category": "words",
    "level": 9,
    "before_fields": {
      "title_en": "tired",
      "title_ja": "疲れた",
      "content": {
        "word": "tired",
        "japanese": "疲れた",
        "kanaReading": "タイアード",
        "pronunciationHint": "Usually one smooth syllable in natural speech.",
        "exampleSentence": "We were tired after the long walk.",
        "exampleJapanese": "長く歩いた後、私たちは疲れていました。",
        "commonMistake": "Use “tired” for your feeling and “tiring” for the cause.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "feelings-and-needs"
      },
      "icon": "🥱",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "tired"
      ]
    },
    "after_fields": {
      "title_en": "tired",
      "title_ja": "疲れた",
      "content": {
        "word": "tired",
        "japanese": "疲れた",
        "kanaReading": "タイアード",
        "pronunciationHint": "US English often has one smooth syllable /taɪrd/. UK English may glide through /aɪə/ before d.",
        "exampleSentence": "We were tired after the long walk.",
        "exampleJapanese": "長く歩いた後、私たちは疲れていました。",
        "commonMistake": "Use “tired” for your feeling and “tiring” for the cause.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-db090d2f7bdcc654.svg",
          "kind": "single",
          "altEn": "An illustration of tired.",
          "altJa": "疲れたのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "feelings-and-needs"
      },
      "icon": "",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "tired"
      ]
    }
  },
  {
    "id": "word-l09-angry",
    "category": "words",
    "level": 9,
    "before_fields": {
      "title_en": "angry",
      "title_ja": "怒っている",
      "content": {
        "word": "angry",
        "japanese": "怒っている",
        "kanaReading": "アングリー",
        "pronunciationHint": "Stress ANG and pronounce the g.",
        "exampleSentence": "He was angry about the broken promise.",
        "exampleJapanese": "彼は約束が破られたことに怒っていました。",
        "commonMistake": "Use “angry with someone” or “angry about something.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "feelings-and-needs"
      },
      "icon": "😠",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "angry"
      ]
    },
    "after_fields": {
      "title_en": "angry",
      "title_ja": "怒っている",
      "content": {
        "word": "angry",
        "japanese": "怒っている",
        "kanaReading": "アングリー",
        "pronunciationHint": "Stress ANG and pronounce the g.",
        "exampleSentence": "He is angry about the broken toy.",
        "exampleJapanese": "彼はおもちゃが壊れたことに怒っています。",
        "commonMistake": "Use “angry with someone” or “angry about something.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4027b124a75a355e.svg",
          "kind": "single",
          "altEn": "An illustration of angry.",
          "altJa": "怒っているのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "feelings-and-needs"
      },
      "icon": "",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "angry"
      ]
    }
  },
  {
    "id": "word-l09-scared",
    "category": "words",
    "level": 9,
    "before_fields": {
      "title_en": "scared",
      "title_ja": "怖がっている",
      "content": {
        "word": "scared",
        "japanese": "怖がっている",
        "kanaReading": "スケアード",
        "pronunciationHint": "Blend /sk/ and finish with d.",
        "exampleSentence": "The child is scared of thunder.",
        "exampleJapanese": "その子は雷を怖がっています。",
        "commonMistake": "Say “scared of,” not “scared from.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "feelings-and-needs"
      },
      "icon": "😨",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "scared"
      ]
    },
    "after_fields": {
      "title_en": "scared",
      "title_ja": "怖がっている",
      "content": {
        "word": "scared",
        "japanese": "怖がっている",
        "kanaReading": "スケアード",
        "pronunciationHint": "Blend /sk/ and finish with d.",
        "exampleSentence": "The child is scared of thunder.",
        "exampleJapanese": "その子は雷を怖がっています。",
        "commonMistake": "Say “scared of,” not “scared from.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-29ea0dca00f8845f.svg",
          "kind": "single",
          "altEn": "An illustration of scared.",
          "altJa": "怖がっているのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "feelings-and-needs"
      },
      "icon": "",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "scared"
      ]
    }
  },
  {
    "id": "word-l09-excited",
    "category": "words",
    "level": 9,
    "before_fields": {
      "title_en": "excited",
      "title_ja": "わくわくした",
      "content": {
        "word": "excited",
        "japanese": "わくわくした",
        "kanaReading": "イクサイティッド",
        "pronunciationHint": "Stress CI: ex-CI-ted.",
        "exampleSentence": "I am excited about the school trip.",
        "exampleJapanese": "私は遠足を楽しみにしています。",
        "commonMistake": "Use “excited” for a person and “exciting” for an event.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "feelings-and-needs"
      },
      "icon": "🤩",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "excited"
      ]
    },
    "after_fields": {
      "title_en": "excited",
      "title_ja": "わくわくした",
      "content": {
        "word": "excited",
        "japanese": "わくわくした",
        "kanaReading": "イクサイティッド",
        "pronunciationHint": "Stress CI: ex-CI-ted.",
        "exampleSentence": "I am excited about the school trip.",
        "exampleJapanese": "私は遠足を楽しみにしています。",
        "commonMistake": "Use “excited” for a person and “exciting” for an event.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-87ea2e70058a3acc.svg",
          "kind": "single",
          "altEn": "An illustration of excited.",
          "altJa": "わくわくしたのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "feelings-and-needs"
      },
      "icon": "",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "excited"
      ]
    }
  },
  {
    "id": "word-l09-hungry",
    "category": "words",
    "level": 9,
    "before_fields": {
      "title_en": "hungry",
      "title_ja": "お腹が空いた",
      "content": {
        "word": "hungry",
        "japanese": "お腹が空いた",
        "kanaReading": "ハングリー",
        "pronunciationHint": "Stress HUN and pronounce ng as one sound.",
        "exampleSentence": "I am hungry after swimming.",
        "exampleJapanese": "泳いだ後はお腹が空きます。",
        "commonMistake": "Say “I am hungry,” not “I have hungry.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "feelings-and-needs"
      },
      "icon": "😋",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "hungry"
      ]
    },
    "after_fields": {
      "title_en": "hungry",
      "title_ja": "お腹が空いた",
      "content": {
        "word": "hungry",
        "japanese": "お腹が空いた",
        "kanaReading": "ハングリー",
        "pronunciationHint": "Stress HUN. After /ŋ/, pronounce /ɡ/ before /r/: /ˈhʌŋɡri/.",
        "exampleSentence": "I am hungry after swimming.",
        "exampleJapanese": "泳いだ後はお腹が空きます。",
        "commonMistake": "Say “I am hungry,” not “I have hungry.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-93b44bd6ba7bb14d.svg",
          "kind": "single",
          "altEn": "An illustration of hungry.",
          "altJa": "お腹が空いたのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "feelings-and-needs"
      },
      "icon": "",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "hungry"
      ]
    }
  },
  {
    "id": "word-l09-thirsty",
    "category": "words",
    "level": 9,
    "before_fields": {
      "title_en": "thirsty",
      "title_ja": "喉が渇いた",
      "content": {
        "word": "thirsty",
        "japanese": "喉が渇いた",
        "kanaReading": "サースティー",
        "pronunciationHint": "Begin with unvoiced th /θ/.",
        "exampleSentence": "Are you thirsty after practice?",
        "exampleJapanese": "練習の後、喉が渇いていますか。",
        "commonMistake": "Do not replace th with s.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "feelings-and-needs"
      },
      "icon": "🥤",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "thirsty"
      ]
    },
    "after_fields": {
      "title_en": "thirsty",
      "title_ja": "喉が渇いた",
      "content": {
        "word": "thirsty",
        "japanese": "喉が渇いた",
        "kanaReading": "サースティー",
        "pronunciationHint": "Begin with unvoiced th /θ/.",
        "exampleSentence": "Are you thirsty after practice?",
        "exampleJapanese": "練習の後、喉が渇いていますか。",
        "commonMistake": "Do not replace th with s.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d3e72446b1af3e97.svg",
          "kind": "single",
          "altEn": "An illustration of thirsty.",
          "altJa": "喉が渇いたのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "feelings-and-needs"
      },
      "icon": "",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "thirsty"
      ]
    }
  },
  {
    "id": "word-l09-sick",
    "category": "words",
    "level": 9,
    "before_fields": {
      "title_en": "sick",
      "title_ja": "具合が悪い",
      "content": {
        "word": "sick",
        "japanese": "具合が悪い",
        "kanaReading": "シック",
        "pronunciationHint": "Use short /ɪ/ and a final k.",
        "exampleSentence": "I stayed home because I was sick.",
        "exampleJapanese": "具合が悪かったので家にいました。",
        "commonMistake": "In British English, “be sick” can also mean vomit.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "feelings-and-needs"
      },
      "icon": "🤒",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "sick"
      ]
    },
    "after_fields": {
      "title_en": "sick",
      "title_ja": "具合が悪い",
      "content": {
        "word": "sick",
        "japanese": "具合が悪い",
        "kanaReading": "シック",
        "pronunciationHint": "Use short /ɪ/ and a final k.",
        "exampleSentence": "I stayed home because I was sick.",
        "exampleJapanese": "具合が悪かったので家にいました。",
        "commonMistake": "In British English, “be sick” can also mean vomit.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ba5541f292049aeb.svg",
          "kind": "scene",
          "altEn": "An unwell person with a headache and a thermometer.",
          "altJa": "頭が痛く、体温を測っている具合の悪い人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "feelings-and-needs"
      },
      "icon": "",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "sick"
      ]
    }
  },
  {
    "id": "word-l09-fine",
    "category": "words",
    "level": 9,
    "before_fields": {
      "title_en": "fine",
      "title_ja": "元気な・大丈夫な",
      "content": {
        "word": "fine",
        "japanese": "元気な・大丈夫な",
        "kanaReading": "ファイン",
        "pronunciationHint": "Use the /aɪ/ vowel.",
        "exampleSentence": "I am fine now, thank you.",
        "exampleJapanese": "今は大丈夫です、ありがとう。",
        "commonMistake": "“Fine” can sound merely okay, not always excellent.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "feelings-and-needs"
      },
      "icon": "🙂",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "fine"
      ]
    },
    "after_fields": {
      "title_en": "fine",
      "title_ja": "元気な・大丈夫な",
      "content": {
        "word": "fine",
        "japanese": "元気な・大丈夫な",
        "kanaReading": "ファイン",
        "pronunciationHint": "Use the /aɪ/ vowel.",
        "exampleSentence": "I am fine now, thank you.",
        "exampleJapanese": "今は大丈夫です、ありがとう。",
        "commonMistake": "“Fine” can sound merely okay, not always excellent.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-228365cf7551b20a.svg",
          "kind": "scene",
          "altEn": "A person feeling well gives a positive sign.",
          "altJa": "元気な人が大丈夫という合図をしています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "feelings-and-needs"
      },
      "icon": "",
      "tags": [
        "feelings-and-needs",
        "level-9",
        "fine"
      ]
    }
  },
  {
    "id": "word-l10-sunny",
    "category": "words",
    "level": 10,
    "before_fields": {
      "title_en": "sunny",
      "title_ja": "晴れた",
      "content": {
        "word": "sunny",
        "japanese": "晴れた",
        "kanaReading": "サニー",
        "pronunciationHint": "Stress SUN; the final y is /i/.",
        "exampleSentence": "It will be sunny this afternoon.",
        "exampleJapanese": "今日の午後は晴れるでしょう。",
        "commonMistake": "Use “sunny,” not “sun,” after “It is.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "weather-and-nature"
      },
      "icon": "☀️",
      "tags": [
        "weather-and-nature",
        "level-10",
        "sunny"
      ]
    },
    "after_fields": {
      "title_en": "sunny",
      "title_ja": "晴れた",
      "content": {
        "word": "sunny",
        "japanese": "晴れた",
        "kanaReading": "サニー",
        "pronunciationHint": "Stress SUN; the final y is /i/.",
        "exampleSentence": "It will be sunny this afternoon.",
        "exampleJapanese": "今日の午後は晴れるでしょう。",
        "commonMistake": "Use “sunny,” not “sun,” after “It is.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-feac1872623c4a98.svg",
          "kind": "scene",
          "altEn": "Sunlight shines on a tree outdoors.",
          "altJa": "屋外の木に太陽の光が当たっています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "weather-and-nature"
      },
      "icon": "",
      "tags": [
        "weather-and-nature",
        "level-10",
        "sunny"
      ]
    }
  },
  {
    "id": "word-l10-rainy",
    "category": "words",
    "level": 10,
    "before_fields": {
      "title_en": "rainy",
      "title_ja": "雨の",
      "content": {
        "word": "rainy",
        "japanese": "雨の",
        "kanaReading": "レイニー",
        "pronunciationHint": "Use the long /eɪ/ in the first syllable.",
        "exampleSentence": "We need boots on rainy days.",
        "exampleJapanese": "雨の日には長靴が必要です。",
        "commonMistake": "Use “rainy” for weather and “raining” for the action now.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "weather-and-nature"
      },
      "icon": "🌧️",
      "tags": [
        "weather-and-nature",
        "level-10",
        "rainy"
      ]
    },
    "after_fields": {
      "title_en": "rainy",
      "title_ja": "雨の",
      "content": {
        "word": "rainy",
        "japanese": "雨の",
        "kanaReading": "レイニー",
        "pronunciationHint": "Use the long /eɪ/ in the first syllable.",
        "exampleSentence": "We need boots on rainy days.",
        "exampleJapanese": "雨の日には長靴が必要です。",
        "commonMistake": "Use “rainy” for weather and “raining” for the action now.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-399b3a3d5ac4df6b.svg",
          "kind": "scene",
          "altEn": "Rain falls on an open umbrella.",
          "altJa": "開いた傘に雨が降っています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "weather-and-nature"
      },
      "icon": "",
      "tags": [
        "weather-and-nature",
        "level-10",
        "rainy"
      ]
    }
  },
  {
    "id": "word-l10-cloudy",
    "category": "words",
    "level": 10,
    "before_fields": {
      "title_en": "cloudy",
      "title_ja": "曇った",
      "content": {
        "word": "cloudy",
        "japanese": "曇った",
        "kanaReading": "クラウディー",
        "pronunciationHint": "Blend /kl/ and glide through /aʊ/.",
        "exampleSentence": "The sky became cloudy before lunch.",
        "exampleJapanese": "昼食前に空が曇りました。",
        "commonMistake": "Do not use “cloud” directly after “It is.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "weather-and-nature"
      },
      "icon": "☁️",
      "tags": [
        "weather-and-nature",
        "level-10",
        "cloudy"
      ]
    },
    "after_fields": {
      "title_en": "cloudy",
      "title_ja": "曇った",
      "content": {
        "word": "cloudy",
        "japanese": "曇った",
        "kanaReading": "クラウディー",
        "pronunciationHint": "Blend /kl/ and glide through /aʊ/.",
        "exampleSentence": "The sky became cloudy before lunch.",
        "exampleJapanese": "昼食前に空が曇りました。",
        "commonMistake": "Do not use “cloud” directly after “It is.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d1a93f2ef976b1a4.svg",
          "kind": "single",
          "altEn": "An illustration of cloudy.",
          "altJa": "曇ったのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "weather-and-nature"
      },
      "icon": "",
      "tags": [
        "weather-and-nature",
        "level-10",
        "cloudy"
      ]
    }
  },
  {
    "id": "word-l10-windy",
    "category": "words",
    "level": 10,
    "before_fields": {
      "title_en": "windy",
      "title_ja": "風が強い",
      "content": {
        "word": "windy",
        "japanese": "風が強い",
        "kanaReading": "ウィンディー",
        "pronunciationHint": "Stress WIN; keep the d audible.",
        "exampleSentence": "It is too windy for a picnic.",
        "exampleJapanese": "風が強すぎてピクニックには向きません。",
        "commonMistake": "Do not confuse “windy” with “winding.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "weather-and-nature"
      },
      "icon": "🌬️",
      "tags": [
        "weather-and-nature",
        "level-10",
        "windy"
      ]
    },
    "after_fields": {
      "title_en": "windy",
      "title_ja": "風が強い",
      "content": {
        "word": "windy",
        "japanese": "風が強い",
        "kanaReading": "ウィンディー",
        "pronunciationHint": "Stress WIN; keep the d audible.",
        "exampleSentence": "It is too windy for a picnic.",
        "exampleJapanese": "風が強すぎてピクニックには向きません。",
        "commonMistake": "Do not confuse “windy” with “winding.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-e6dc93261510d33b.svg",
          "kind": "scene",
          "altEn": "Wind bends a tree and blows a scarf sideways.",
          "altJa": "風で木が傾き、マフラーが横になびいています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "weather-and-nature"
      },
      "icon": "",
      "tags": [
        "weather-and-nature",
        "level-10",
        "windy"
      ]
    }
  },
  {
    "id": "word-l10-hot",
    "category": "words",
    "level": 10,
    "before_fields": {
      "title_en": "hot",
      "title_ja": "暑い・熱い",
      "content": {
        "word": "hot",
        "japanese": "暑い・熱い",
        "kanaReading": "ホット",
        "pronunciationHint": "Use a short open vowel.",
        "exampleSentence": "The sand is hot in the sun.",
        "exampleJapanese": "日なたの砂は熱いです。",
        "commonMistake": "Use “hot” for temperature, not “high.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "weather-and-nature"
      },
      "icon": "🥵",
      "tags": [
        "weather-and-nature",
        "level-10",
        "hot"
      ]
    },
    "after_fields": {
      "title_en": "hot",
      "title_ja": "暑い・熱い",
      "content": {
        "word": "hot",
        "japanese": "暑い・熱い",
        "kanaReading": "ホット",
        "pronunciationHint": "Use a short open vowel.",
        "exampleSentence": "The sand is hot in the sun.",
        "exampleJapanese": "日なたの砂は熱いです。",
        "commonMistake": "Use “hot” for temperature, not “high.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-01262b65fd691920.svg",
          "kind": "single",
          "altEn": "An illustration of hot.",
          "altJa": "暑い・熱いのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "weather-and-nature"
      },
      "icon": "",
      "tags": [
        "weather-and-nature",
        "level-10",
        "hot"
      ]
    }
  },
  {
    "id": "word-l10-cold",
    "category": "words",
    "level": 10,
    "before_fields": {
      "title_en": "cold",
      "title_ja": "寒い・冷たい",
      "content": {
        "word": "cold",
        "japanese": "寒い・冷たい",
        "kanaReading": "コウルド",
        "pronunciationHint": "Use /oʊ/ and keep the /ld/ ending.",
        "exampleSentence": "My hands are cold.",
        "exampleJapanese": "手が冷たいです。",
        "commonMistake": "Say “I am cold” for your feeling, not “I have cold.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "weather-and-nature"
      },
      "icon": "🥶",
      "tags": [
        "weather-and-nature",
        "level-10",
        "cold"
      ]
    },
    "after_fields": {
      "title_en": "cold",
      "title_ja": "寒い・冷たい",
      "content": {
        "word": "cold",
        "japanese": "寒い・冷たい",
        "kanaReading": "コウルド",
        "pronunciationHint": "Use /oʊ/ and keep the /ld/ ending.",
        "exampleSentence": "My hands are cold.",
        "exampleJapanese": "手が冷たいです。",
        "commonMistake": "Say “I am cold” for your feeling, not “I have cold.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c1677b87a6884844.svg",
          "kind": "scene",
          "altEn": "A person needs a warm coat in falling snow.",
          "altJa": "雪の中で暖かいコートが必要な寒さ。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "weather-and-nature"
      },
      "icon": "",
      "tags": [
        "weather-and-nature",
        "level-10",
        "cold"
      ]
    }
  },
  {
    "id": "word-l10-sky",
    "category": "words",
    "level": 10,
    "before_fields": {
      "title_en": "sky",
      "title_ja": "空",
      "content": {
        "word": "sky",
        "japanese": "空",
        "kanaReading": "スカイ",
        "pronunciationHint": "Blend /sk/ before /aɪ/.",
        "exampleSentence": "The evening sky turned pink.",
        "exampleJapanese": "夕方の空がピンク色になりました。",
        "commonMistake": "Use “in the sky,” not usually “on the sky.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "weather-and-nature"
      },
      "icon": "🌌",
      "tags": [
        "weather-and-nature",
        "level-10",
        "sky"
      ]
    },
    "after_fields": {
      "title_en": "sky",
      "title_ja": "空",
      "content": {
        "word": "sky",
        "japanese": "空",
        "kanaReading": "スカイ",
        "pronunciationHint": "Blend /sk/ before /aɪ/.",
        "exampleSentence": "The evening sky turned pink.",
        "exampleJapanese": "夕方の空がピンク色になりました。",
        "commonMistake": "Use “in the sky,” not usually “on the sky.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-2e75d1504d9f1a0f.svg",
          "kind": "scene",
          "altEn": "A bird flies high among clouds, with the open sky highlighted.",
          "altJa": "雲の間を鳥が飛び、広い空が示されています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "weather-and-nature"
      },
      "icon": "",
      "tags": [
        "weather-and-nature",
        "level-10",
        "sky"
      ]
    }
  },
  {
    "id": "word-l10-sun",
    "category": "words",
    "level": 10,
    "before_fields": {
      "title_en": "sun",
      "title_ja": "太陽",
      "content": {
        "word": "sun",
        "japanese": "太陽",
        "kanaReading": "サン",
        "pronunciationHint": "Use the short /ʌ/ vowel.",
        "exampleSentence": "The sun rises in the east.",
        "exampleJapanese": "太陽は東から昇ります。",
        "commonMistake": "Use “the sun” with the definite article.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "weather-and-nature"
      },
      "icon": "🌞",
      "tags": [
        "weather-and-nature",
        "level-10",
        "sun"
      ]
    },
    "after_fields": {
      "title_en": "sun",
      "title_ja": "太陽",
      "content": {
        "word": "sun",
        "japanese": "太陽",
        "kanaReading": "サン",
        "pronunciationHint": "Use the short /ʌ/ vowel.",
        "exampleSentence": "The sun rises in the east.",
        "exampleJapanese": "太陽は東から昇ります。",
        "commonMistake": "Use “the sun” with the definite article.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5b2c9e0423ee6a40.svg",
          "kind": "single",
          "altEn": "An illustration of sun.",
          "altJa": "太陽のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "weather-and-nature"
      },
      "icon": "",
      "tags": [
        "weather-and-nature",
        "level-10",
        "sun"
      ]
    }
  },
  {
    "id": "word-l10-moon",
    "category": "words",
    "level": 10,
    "before_fields": {
      "title_en": "moon",
      "title_ja": "月",
      "content": {
        "word": "moon",
        "japanese": "月",
        "kanaReading": "ムーン",
        "pronunciationHint": "Hold the long /uː/ vowel.",
        "exampleSentence": "The moon looks large tonight.",
        "exampleJapanese": "今夜は月が大きく見えます。",
        "commonMistake": "Use “the moon” when referring to Earth’s moon.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "weather-and-nature"
      },
      "icon": "🌙",
      "tags": [
        "weather-and-nature",
        "level-10",
        "moon"
      ]
    },
    "after_fields": {
      "title_en": "moon",
      "title_ja": "月",
      "content": {
        "word": "moon",
        "japanese": "月",
        "kanaReading": "ムーン",
        "pronunciationHint": "Hold the long /uː/ vowel.",
        "exampleSentence": "The moon looks large tonight.",
        "exampleJapanese": "今夜は月が大きく見えます。",
        "commonMistake": "Use “the moon” when referring to Earth’s moon.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-a8d2ce4f1e076d5f.svg",
          "kind": "single",
          "altEn": "An illustration of moon.",
          "altJa": "月のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "weather-and-nature"
      },
      "icon": "",
      "tags": [
        "weather-and-nature",
        "level-10",
        "moon"
      ]
    }
  },
  {
    "id": "word-l10-snow",
    "category": "words",
    "level": 10,
    "before_fields": {
      "title_en": "snow",
      "title_ja": "雪",
      "content": {
        "word": "snow",
        "japanese": "雪",
        "kanaReading": "スノウ",
        "pronunciationHint": "Blend /sn/ and glide through /oʊ/.",
        "exampleSentence": "Fresh snow covered the road.",
        "exampleJapanese": "新雪が道路を覆いました。",
        "commonMistake": "“Snow” is usually uncountable; avoid “a snow.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "weather-and-nature"
      },
      "icon": "❄️",
      "tags": [
        "weather-and-nature",
        "level-10",
        "snow"
      ]
    },
    "after_fields": {
      "title_en": "snow",
      "title_ja": "雪",
      "content": {
        "word": "snow",
        "japanese": "雪",
        "kanaReading": "スノウ",
        "pronunciationHint": "Blend /sn/ and glide through /oʊ/.",
        "exampleSentence": "Fresh snow covered the road.",
        "exampleJapanese": "新雪が道路を覆いました。",
        "commonMistake": "“Snow” is usually uncountable; avoid “a snow.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-2b6b622a662e6bf1.svg",
          "kind": "single",
          "altEn": "An illustration of snow.",
          "altJa": "雪のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "weather-and-nature"
      },
      "icon": "",
      "tags": [
        "weather-and-nature",
        "level-10",
        "snow"
      ]
    }
  },
  {
    "id": "word-l11-morning",
    "category": "words",
    "level": 11,
    "before_fields": {
      "title_en": "morning",
      "title_ja": "朝",
      "content": {
        "word": "morning",
        "japanese": "朝",
        "kanaReading": "モーニング",
        "pronunciationHint": "Stress MORN; the ending is weak.",
        "exampleSentence": "I study English every morning.",
        "exampleJapanese": "私は毎朝英語を勉強します。",
        "commonMistake": "Say “in the morning,” but “this morning” without “in.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "time-and-routines"
      },
      "icon": "🌅",
      "tags": [
        "time-and-routines",
        "level-11",
        "morning"
      ]
    },
    "after_fields": {
      "title_en": "morning",
      "title_ja": "朝",
      "content": {
        "word": "morning",
        "japanese": "朝",
        "kanaReading": "モーニング",
        "pronunciationHint": "Stress MORN; the ending is weak.",
        "exampleSentence": "I study English every morning.",
        "exampleJapanese": "私は毎朝英語を勉強します。",
        "commonMistake": "Say “in the morning,” but “this morning” without “in.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d0712ae740d77a56.svg",
          "kind": "single",
          "altEn": "An illustration of morning.",
          "altJa": "朝のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "time-and-routines"
      },
      "icon": "",
      "tags": [
        "time-and-routines",
        "level-11",
        "morning"
      ]
    }
  },
  {
    "id": "word-l11-afternoon",
    "category": "words",
    "level": 11,
    "before_fields": {
      "title_en": "afternoon",
      "title_ja": "午後",
      "content": {
        "word": "afternoon",
        "japanese": "午後",
        "kanaReading": "アフタヌーン",
        "pronunciationHint": "Stress the final syllable: after-NOON.",
        "exampleSentence": "The meeting is this afternoon.",
        "exampleJapanese": "会議は今日の午後です。",
        "commonMistake": "Do not say “in this afternoon.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "time-and-routines"
      },
      "icon": "🌤️",
      "tags": [
        "time-and-routines",
        "level-11",
        "afternoon"
      ]
    },
    "after_fields": {
      "title_en": "afternoon",
      "title_ja": "午後",
      "content": {
        "word": "afternoon",
        "japanese": "午後",
        "kanaReading": "アフタヌーン",
        "pronunciationHint": "Stress the final syllable: after-NOON.",
        "exampleSentence": "The meeting is this afternoon.",
        "exampleJapanese": "会議は今日の午後です。",
        "commonMistake": "Do not say “in this afternoon.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-40364baa3007b9e8.svg",
          "kind": "single",
          "altEn": "An illustration of afternoon.",
          "altJa": "午後のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "time-and-routines"
      },
      "icon": "",
      "tags": [
        "time-and-routines",
        "level-11",
        "afternoon"
      ]
    }
  },
  {
    "id": "word-l11-evening",
    "category": "words",
    "level": 11,
    "before_fields": {
      "title_en": "evening",
      "title_ja": "夕方・晩",
      "content": {
        "word": "evening",
        "japanese": "夕方・晩",
        "kanaReading": "イーブニング",
        "pronunciationHint": "Stress EVE and keep the middle light.",
        "exampleSentence": "We take a walk in the evening.",
        "exampleJapanese": "私たちは夕方に散歩します。",
        "commonMistake": "Use “in the evening,” but “this evening” without “in.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "time-and-routines"
      },
      "icon": "🌆",
      "tags": [
        "time-and-routines",
        "level-11",
        "evening"
      ]
    },
    "after_fields": {
      "title_en": "evening",
      "title_ja": "夕方・晩",
      "content": {
        "word": "evening",
        "japanese": "夕方・晩",
        "kanaReading": "イーブニング",
        "pronunciationHint": "Stress EVE and keep the middle light.",
        "exampleSentence": "We take a walk in the evening.",
        "exampleJapanese": "私たちは夕方に散歩します。",
        "commonMistake": "Use “in the evening,” but “this evening” without “in.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-164dea03346a49d2.svg",
          "kind": "scene",
          "altEn": "The sun is low behind a house as daylight fades.",
          "altJa": "家の向こうに太陽が沈み、夕方になっています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "time-and-routines"
      },
      "icon": "",
      "tags": [
        "time-and-routines",
        "level-11",
        "evening"
      ]
    }
  },
  {
    "id": "word-l11-night",
    "category": "words",
    "level": 11,
    "before_fields": {
      "title_en": "night",
      "title_ja": "夜",
      "content": {
        "word": "night",
        "japanese": "夜",
        "kanaReading": "ナイト",
        "pronunciationHint": "The gh is silent; finish with t.",
        "exampleSentence": "I read before bed at night.",
        "exampleJapanese": "私は夜、寝る前に本を読みます。",
        "commonMistake": "Say “at night,” not “in night.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "time-and-routines"
      },
      "icon": "🌃",
      "tags": [
        "time-and-routines",
        "level-11",
        "night"
      ]
    },
    "after_fields": {
      "title_en": "night",
      "title_ja": "夜",
      "content": {
        "word": "night",
        "japanese": "夜",
        "kanaReading": "ナイト",
        "pronunciationHint": "The gh is silent; finish with t.",
        "exampleSentence": "I read before bed at night.",
        "exampleJapanese": "私は夜、寝る前に本を読みます。",
        "commonMistake": "Say “at night,” not “in night.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ebd32a057519f888.svg",
          "kind": "single",
          "altEn": "An illustration of night.",
          "altJa": "夜のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "time-and-routines"
      },
      "icon": "",
      "tags": [
        "time-and-routines",
        "level-11",
        "night"
      ]
    }
  },
  {
    "id": "word-l11-today",
    "category": "words",
    "level": 11,
    "before_fields": {
      "title_en": "today",
      "title_ja": "今日",
      "content": {
        "word": "today",
        "japanese": "今日",
        "kanaReading": "トゥデイ",
        "pronunciationHint": "Stress DAY.",
        "exampleSentence": "I have plenty of time today.",
        "exampleJapanese": "今日は時間がたっぷりあります。",
        "commonMistake": "Do not add “on” before “today.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "time-and-routines"
      },
      "icon": "📅",
      "tags": [
        "time-and-routines",
        "level-11",
        "today"
      ]
    },
    "after_fields": {
      "title_en": "today",
      "title_ja": "今日",
      "content": {
        "word": "today",
        "japanese": "今日",
        "kanaReading": "トゥデイ",
        "pronunciationHint": "Stress DAY.",
        "exampleSentence": "I have plenty of time today.",
        "exampleJapanese": "今日は時間がたっぷりあります。",
        "commonMistake": "Do not add “on” before “today.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7ae0938f7ce74d3b.svg",
          "kind": "single",
          "altEn": "An illustration of today.",
          "altJa": "今日のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "time-and-routines"
      },
      "icon": "",
      "tags": [
        "time-and-routines",
        "level-11",
        "today"
      ]
    }
  },
  {
    "id": "word-l11-tomorrow",
    "category": "words",
    "level": 11,
    "before_fields": {
      "title_en": "tomorrow",
      "title_ja": "明日",
      "content": {
        "word": "tomorrow",
        "japanese": "明日",
        "kanaReading": "トゥモロウ",
        "pronunciationHint": "Stress MOR: to-MOR-row.",
        "exampleSentence": "Let us finish this tomorrow.",
        "exampleJapanese": "これは明日終わらせましょう。",
        "commonMistake": "Do not add “on” before “tomorrow.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "time-and-routines"
      },
      "icon": "➡️",
      "tags": [
        "time-and-routines",
        "level-11",
        "tomorrow"
      ]
    },
    "after_fields": {
      "title_en": "tomorrow",
      "title_ja": "明日",
      "content": {
        "word": "tomorrow",
        "japanese": "明日",
        "kanaReading": "トゥモロウ",
        "pronunciationHint": "Stress MOR: to-MOR-row.",
        "exampleSentence": "Let us finish this tomorrow.",
        "exampleJapanese": "これは明日終わらせましょう。",
        "commonMistake": "Do not add “on” before “tomorrow.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-0635777f0512af08.svg",
          "kind": "single",
          "altEn": "An illustration of tomorrow.",
          "altJa": "明日のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "time-and-routines"
      },
      "icon": "",
      "tags": [
        "time-and-routines",
        "level-11",
        "tomorrow"
      ]
    }
  },
  {
    "id": "word-l11-yesterday",
    "category": "words",
    "level": 11,
    "before_fields": {
      "title_en": "yesterday",
      "title_ja": "昨日",
      "content": {
        "word": "yesterday",
        "japanese": "昨日",
        "kanaReading": "イエスタデイ",
        "pronunciationHint": "Stress YES and keep the rest lighter.",
        "exampleSentence": "Yesterday was my day off.",
        "exampleJapanese": "昨日は休みでした。",
        "commonMistake": "Do not use present tense for a finished event yesterday.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "time-and-routines"
      },
      "icon": "⬅️",
      "tags": [
        "time-and-routines",
        "level-11",
        "yesterday"
      ]
    },
    "after_fields": {
      "title_en": "yesterday",
      "title_ja": "昨日",
      "content": {
        "word": "yesterday",
        "japanese": "昨日",
        "kanaReading": "イエスタデイ",
        "pronunciationHint": "Stress YES and keep the rest lighter.",
        "exampleSentence": "Yesterday was my day off.",
        "exampleJapanese": "昨日は休みでした。",
        "commonMistake": "Do not use present tense for a finished event yesterday.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-3da8b865d506ce81.svg",
          "kind": "single",
          "altEn": "An illustration of yesterday.",
          "altJa": "昨日のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "time-and-routines"
      },
      "icon": "",
      "tags": [
        "time-and-routines",
        "level-11",
        "yesterday"
      ]
    }
  },
  {
    "id": "word-l11-early",
    "category": "words",
    "level": 11,
    "before_fields": {
      "title_en": "early",
      "title_ja": "早く・早い",
      "content": {
        "word": "early",
        "japanese": "早く・早い",
        "kanaReading": "アーリー",
        "pronunciationHint": "Use an r-colored first vowel in US English.",
        "exampleSentence": "She arrived ten minutes early.",
        "exampleJapanese": "彼女は10分早く着きました。",
        "commonMistake": "“Early” is not the same as “fast.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "time-and-routines"
      },
      "icon": "⏰",
      "tags": [
        "time-and-routines",
        "level-11",
        "early"
      ]
    },
    "after_fields": {
      "title_en": "early",
      "title_ja": "早く・早い",
      "content": {
        "word": "early",
        "japanese": "早く・早い",
        "kanaReading": "アーリー",
        "pronunciationHint": "Use an r-colored first vowel in US English.",
        "exampleSentence": "She arrived ten minutes early.",
        "exampleJapanese": "彼女は10分早く着きました。",
        "commonMistake": "“Early” is not the same as “fast.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-bba84f7238cd6877.svg",
          "kind": "contrast",
          "altEn": "A passenger arrives at 8:50 for a bus leaving at 9:00.",
          "altJa": "9時発のバスに8時50分に着く人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "time-and-routines"
      },
      "icon": "",
      "tags": [
        "time-and-routines",
        "level-11",
        "early"
      ]
    }
  },
  {
    "id": "word-l11-late",
    "category": "words",
    "level": 11,
    "before_fields": {
      "title_en": "late",
      "title_ja": "遅い・遅れて",
      "content": {
        "word": "late",
        "japanese": "遅い・遅れて",
        "kanaReading": "レイト",
        "pronunciationHint": "Use the long /eɪ/ vowel.",
        "exampleSentence": "The train is five minutes late.",
        "exampleJapanese": "電車は5分遅れています。",
        "commonMistake": "Use “late for” an event or obligation; “late to class” is also common when focusing on arrival.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "time-and-routines"
      },
      "icon": "⌛",
      "tags": [
        "time-and-routines",
        "level-11",
        "late"
      ]
    },
    "after_fields": {
      "title_en": "late",
      "title_ja": "遅い・遅れて",
      "content": {
        "word": "late",
        "japanese": "遅い・遅れて",
        "kanaReading": "レイト",
        "pronunciationHint": "Use the long /eɪ/ vowel.",
        "exampleSentence": "The train is five minutes late.",
        "exampleJapanese": "電車は5分遅れています。",
        "commonMistake": "Use “late for” an event or obligation; “late to class” is also common when focusing on arrival.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-bf48c5abc042abcb.svg",
          "kind": "contrast",
          "altEn": "A passenger arrives at 9:10 after the bus left at 9:00.",
          "altJa": "9時発のバスに9時10分に着き、乗り遅れた人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "time-and-routines"
      },
      "icon": "",
      "tags": [
        "time-and-routines",
        "level-11",
        "late"
      ]
    }
  },
  {
    "id": "word-l11-busy",
    "category": "words",
    "level": 11,
    "before_fields": {
      "title_en": "busy",
      "title_ja": "忙しい",
      "content": {
        "word": "busy",
        "japanese": "忙しい",
        "kanaReading": "ビジー",
        "pronunciationHint": "Pronounce the s like /z/: BIZ-ee.",
        "exampleSentence": "I am busy until Friday.",
        "exampleJapanese": "私は金曜日まで忙しいです。",
        "commonMistake": "Do not pronounce the s as /s/.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "time-and-routines"
      },
      "icon": "📋",
      "tags": [
        "time-and-routines",
        "level-11",
        "busy"
      ]
    },
    "after_fields": {
      "title_en": "busy",
      "title_ja": "忙しい",
      "content": {
        "word": "busy",
        "japanese": "忙しい",
        "kanaReading": "ビジー",
        "pronunciationHint": "Pronounce the s like /z/: BIZ-ee.",
        "exampleSentence": "I am busy until Friday.",
        "exampleJapanese": "私は金曜日まで忙しいです。",
        "commonMistake": "Do not pronounce the s as /s/.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-15241d2f6fbdeeb1.svg",
          "kind": "single",
          "altEn": "An illustration of busy.",
          "altJa": "忙しいのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "time-and-routines"
      },
      "icon": "",
      "tags": [
        "time-and-routines",
        "level-11",
        "busy"
      ]
    }
  },
  {
    "id": "word-l12-school",
    "category": "words",
    "level": 12,
    "before_fields": {
      "title_en": "school",
      "title_ja": "学校",
      "content": {
        "word": "school",
        "japanese": "学校",
        "kanaReading": "スクール",
        "pronunciationHint": "Blend /sk/ and hold /uː/.",
        "exampleSentence": "The school is across from the park.",
        "exampleJapanese": "学校は公園の向かいです。",
        "commonMistake": "Say “go to school” without “the” for attending classes.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "places-in-town"
      },
      "icon": "🏫",
      "tags": [
        "places-in-town",
        "level-12",
        "school"
      ]
    },
    "after_fields": {
      "title_en": "school",
      "title_ja": "学校",
      "content": {
        "word": "school",
        "japanese": "学校",
        "kanaReading": "スクール",
        "pronunciationHint": "Blend /sk/ and hold /uː/.",
        "exampleSentence": "The school is across from the park.",
        "exampleJapanese": "学校は公園の向かいです。",
        "commonMistake": "Say “go to school” without “the” for attending classes.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-a1270a969f7238c8.svg",
          "kind": "single",
          "altEn": "An illustration of school.",
          "altJa": "学校のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "places-in-town"
      },
      "icon": "",
      "tags": [
        "places-in-town",
        "level-12",
        "school"
      ]
    }
  },
  {
    "id": "word-l12-park",
    "category": "words",
    "level": 12,
    "before_fields": {
      "title_en": "park",
      "title_ja": "公園",
      "content": {
        "word": "park",
        "japanese": "公園",
        "kanaReading": "パーク",
        "pronunciationHint": "Keep the p unvoiced and use the r in US English.",
        "exampleSentence": "We met near the park gate.",
        "exampleJapanese": "私たちは公園の門の近くで会いました。",
        "commonMistake": "Do not confuse “park” the place with “park” a vehicle.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "places-in-town"
      },
      "icon": "🏞️",
      "tags": [
        "places-in-town",
        "level-12",
        "park"
      ]
    },
    "after_fields": {
      "title_en": "park",
      "title_ja": "公園",
      "content": {
        "word": "park",
        "japanese": "公園",
        "kanaReading": "パーク",
        "pronunciationHint": "Keep the p unvoiced and use the r in US English.",
        "exampleSentence": "We met near the park gate.",
        "exampleJapanese": "私たちは公園の門の近くで会いました。",
        "commonMistake": "Do not confuse “park” the place with “park” a vehicle.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-1b352dd2129dfc25.svg",
          "kind": "scene",
          "altEn": "A green public park with a tree, grass, and a bench.",
          "altJa": "木と芝生、ベンチがある公園。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "places-in-town"
      },
      "icon": "",
      "tags": [
        "places-in-town",
        "level-12",
        "park"
      ]
    }
  },
  {
    "id": "word-l12-station",
    "category": "words",
    "level": 12,
    "before_fields": {
      "title_en": "station",
      "title_ja": "駅",
      "content": {
        "word": "station",
        "japanese": "駅",
        "kanaReading": "ステイション",
        "pronunciationHint": "Stress STAY and use /ʃ/ before the ending.",
        "exampleSentence": "Which station is next?",
        "exampleJapanese": "次はどの駅ですか。",
        "commonMistake": "Use “at the station,” not “in station.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "places-in-town"
      },
      "icon": "🚉",
      "tags": [
        "places-in-town",
        "level-12",
        "station"
      ]
    },
    "after_fields": {
      "title_en": "station",
      "title_ja": "駅",
      "content": {
        "word": "station",
        "japanese": "駅",
        "kanaReading": "ステイション",
        "pronunciationHint": "Stress STAY and use /ʃ/ before the ending.",
        "exampleSentence": "Which station is next?",
        "exampleJapanese": "次はどの駅ですか。",
        "commonMistake": "Use “at the station,” not “in station.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-fa1364c24af7e4bd.svg",
          "kind": "scene",
          "altEn": "A train beside a station sign and departure clock.",
          "altJa": "駅の看板と時計のそばに電車が停まっています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "places-in-town"
      },
      "icon": "",
      "tags": [
        "places-in-town",
        "level-12",
        "station"
      ]
    }
  },
  {
    "id": "word-l12-store",
    "category": "words",
    "level": 12,
    "before_fields": {
      "title_en": "store",
      "title_ja": "店",
      "content": {
        "word": "store",
        "japanese": "店",
        "kanaReading": "ストア",
        "pronunciationHint": "Blend /st/ and hold the vowel.",
        "exampleSentence": "That store closes at eight.",
        "exampleJapanese": "あの店は8時に閉まります。",
        "commonMistake": "British English often uses “shop” where US English uses “store.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "places-in-town"
      },
      "icon": "🏪",
      "tags": [
        "places-in-town",
        "level-12",
        "store"
      ]
    },
    "after_fields": {
      "title_en": "store",
      "title_ja": "店",
      "content": {
        "word": "store",
        "japanese": "店",
        "kanaReading": "ストア",
        "pronunciationHint": "Blend /st/ and hold the vowel.",
        "exampleSentence": "That store closes at eight.",
        "exampleJapanese": "あの店は8時に閉まります。",
        "commonMistake": "British English often uses “shop” where US English uses “store.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-97e262d1093a9314.svg",
          "kind": "single",
          "altEn": "An illustration of store.",
          "altJa": "店のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "places-in-town"
      },
      "icon": "",
      "tags": [
        "places-in-town",
        "level-12",
        "store"
      ]
    }
  },
  {
    "id": "word-l12-hospital",
    "category": "words",
    "level": 12,
    "before_fields": {
      "title_en": "hospital",
      "title_ja": "病院",
      "content": {
        "word": "hospital",
        "japanese": "病院",
        "kanaReading": "ホスピタル",
        "pronunciationHint": "Stress HOS; later syllables are lighter.",
        "exampleSentence": "The hospital is beside the bank.",
        "exampleJapanese": "病院は銀行の隣です。",
        "commonMistake": "Use “go to the hospital” in US English for a visit.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "places-in-town"
      },
      "icon": "🏥",
      "tags": [
        "places-in-town",
        "level-12",
        "hospital"
      ]
    },
    "after_fields": {
      "title_en": "hospital",
      "title_ja": "病院",
      "content": {
        "word": "hospital",
        "japanese": "病院",
        "kanaReading": "ホスピタル",
        "pronunciationHint": "Stress HOS; later syllables are lighter.",
        "exampleSentence": "The hospital is beside the bank.",
        "exampleJapanese": "病院は銀行の隣です。",
        "commonMistake": "Use “go to the hospital” in US English for a visit.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-0d0cd0565e9f40bc.svg",
          "kind": "scene",
          "altEn": "A medical building with a doctor welcoming patients.",
          "altJa": "医療の建物で医師が患者を迎えています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "places-in-town"
      },
      "icon": "",
      "tags": [
        "places-in-town",
        "level-12",
        "hospital"
      ]
    }
  },
  {
    "id": "word-l12-library",
    "category": "words",
    "level": 12,
    "before_fields": {
      "title_en": "library",
      "title_ja": "図書館",
      "content": {
        "word": "library",
        "japanese": "図書館",
        "kanaReading": "ライブラリー",
        "pronunciationHint": "Usually three syllables: LI-brar-y, with the stress on LI.",
        "exampleSentence": "You can borrow this at the library.",
        "exampleJapanese": "これは図書館で借りられます。",
        "commonMistake": "Keep the r after b clear; some speakers reduce the middle syllable in fast speech.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "places-in-town"
      },
      "icon": "📚",
      "tags": [
        "places-in-town",
        "level-12",
        "library"
      ]
    },
    "after_fields": {
      "title_en": "library",
      "title_ja": "図書館",
      "content": {
        "word": "library",
        "japanese": "図書館",
        "kanaReading": "ライブラリー",
        "pronunciationHint": "Usually three syllables: LI-brar-y, with the stress on LI.",
        "exampleSentence": "You can borrow this at the library.",
        "exampleJapanese": "これは図書館で借りられます。",
        "commonMistake": "Keep the r after b clear; some speakers reduce the middle syllable in fast speech.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-987cfef236733d86.svg",
          "kind": "scene",
          "altEn": "A reader sits beside shelves of books in a quiet library.",
          "altJa": "本棚のそばで読書をしている図書館の場面。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "places-in-town"
      },
      "icon": "",
      "tags": [
        "places-in-town",
        "level-12",
        "library"
      ]
    }
  },
  {
    "id": "word-l12-restaurant",
    "category": "words",
    "level": 12,
    "before_fields": {
      "title_en": "restaurant",
      "title_ja": "レストラン",
      "content": {
        "word": "restaurant",
        "japanese": "レストラン",
        "kanaReading": "レストラント",
        "pronunciationHint": "Often three syllables: RES-ta-rant.",
        "exampleSentence": "This restaurant serves vegetable curry.",
        "exampleJapanese": "このレストランでは野菜カレーを出します。",
        "commonMistake": "Do not pronounce every written vowel equally.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "places-in-town"
      },
      "icon": "🍽️",
      "tags": [
        "places-in-town",
        "level-12",
        "restaurant"
      ]
    },
    "after_fields": {
      "title_en": "restaurant",
      "title_ja": "レストラン",
      "content": {
        "word": "restaurant",
        "japanese": "レストラン",
        "kanaReading": "レストラント",
        "pronunciationHint": "Often three syllables: RES-ta-rant.",
        "exampleSentence": "This restaurant serves vegetable curry.",
        "exampleJapanese": "このレストランでは野菜カレーを出します。",
        "commonMistake": "Do not pronounce every written vowel equally.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ce9ed7eb0fbd4176.svg",
          "kind": "scene",
          "altEn": "A waiter serves a meal at a dining table.",
          "altJa": "食卓で店員が料理を出しているレストランの場面。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "places-in-town"
      },
      "icon": "",
      "tags": [
        "places-in-town",
        "level-12",
        "restaurant"
      ]
    }
  },
  {
    "id": "word-l12-bank",
    "category": "words",
    "level": 12,
    "before_fields": {
      "title_en": "bank",
      "title_ja": "銀行",
      "content": {
        "word": "bank",
        "japanese": "銀行",
        "kanaReading": "バンク",
        "pronunciationHint": "Use /æ/ and finish with /ŋk/.",
        "exampleSentence": "The bank is closed today.",
        "exampleJapanese": "銀行は今日休みです。",
        "commonMistake": "Do not add a vowel after k.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "places-in-town"
      },
      "icon": "🏦",
      "tags": [
        "places-in-town",
        "level-12",
        "bank"
      ]
    },
    "after_fields": {
      "title_en": "bank",
      "title_ja": "銀行",
      "content": {
        "word": "bank",
        "japanese": "銀行",
        "kanaReading": "バンク",
        "pronunciationHint": "Use /æ/ and finish with /ŋk/.",
        "exampleSentence": "The bank is closed today.",
        "exampleJapanese": "銀行は今日休みです。",
        "commonMistake": "Do not add a vowel after k.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ef8bde560696830f.svg",
          "kind": "single",
          "altEn": "An illustration of bank.",
          "altJa": "銀行のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "places-in-town"
      },
      "icon": "",
      "tags": [
        "places-in-town",
        "level-12",
        "bank"
      ]
    }
  },
  {
    "id": "word-l12-post-office",
    "category": "words",
    "level": 12,
    "before_fields": {
      "title_en": "post office",
      "title_ja": "郵便局",
      "content": {
        "word": "post office",
        "japanese": "郵便局",
        "kanaReading": "ポウスト オフィス",
        "pronunciationHint": "Keep the final t in “post” before “office.”",
        "exampleSentence": "I mailed the parcel at the post office.",
        "exampleJapanese": "郵便局で小包を送りました。",
        "commonMistake": "Write it as two words, not one.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "places-in-town"
      },
      "icon": "📮",
      "tags": [
        "places-in-town",
        "level-12",
        "post-office"
      ]
    },
    "after_fields": {
      "title_en": "post office",
      "title_ja": "郵便局",
      "content": {
        "word": "post office",
        "japanese": "郵便局",
        "kanaReading": "ポウスト オフィス",
        "pronunciationHint": "Keep the final t in “post” before “office.”",
        "exampleSentence": "I mailed the parcel at the post office.",
        "exampleJapanese": "郵便局で小包を送りました。",
        "commonMistake": "Write it as two words, not one.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f6815b5e77d3cc98.svg",
          "kind": "scene",
          "altEn": "A postal worker helps a customer send a letter.",
          "altJa": "郵便局の職員が手紙を送る人を手伝っています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "places-in-town"
      },
      "icon": "",
      "tags": [
        "places-in-town",
        "level-12",
        "post-office"
      ]
    }
  },
  {
    "id": "word-l12-playground",
    "category": "words",
    "level": 12,
    "before_fields": {
      "title_en": "playground",
      "title_ja": "遊び場・校庭",
      "content": {
        "word": "playground",
        "japanese": "遊び場・校庭",
        "kanaReading": "プレイグラウンド",
        "pronunciationHint": "Stress PLAY and connect both parts smoothly.",
        "exampleSentence": "The children are on the playground.",
        "exampleJapanese": "子どもたちは遊び場にいます。",
        "commonMistake": "US English often uses “on the playground”; UK English commonly uses “in the playground.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "places-in-town"
      },
      "icon": "🛝",
      "tags": [
        "places-in-town",
        "level-12",
        "playground"
      ]
    },
    "after_fields": {
      "title_en": "playground",
      "title_ja": "遊び場・校庭",
      "content": {
        "word": "playground",
        "japanese": "遊び場・校庭",
        "kanaReading": "プレイグラウンド",
        "pronunciationHint": "Stress PLAY and connect both parts smoothly.",
        "exampleSentence": "The children are on the playground.",
        "exampleJapanese": "子どもたちは遊び場にいます。",
        "commonMistake": "US English often uses “on the playground”; UK English commonly uses “in the playground.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-a2d7c7ad1a9b4269.svg",
          "kind": "scene",
          "altEn": "A playground with a slide and someone on a swing.",
          "altJa": "すべり台とブランコのある遊び場。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "places-in-town"
      },
      "icon": "",
      "tags": [
        "places-in-town",
        "level-12",
        "playground"
      ]
    }
  },
  {
    "id": "word-l13-shirt",
    "category": "words",
    "level": 13,
    "before_fields": {
      "title_en": "shirt",
      "title_ja": "シャツ",
      "content": {
        "word": "shirt",
        "japanese": "シャツ",
        "kanaReading": "シャート",
        "pronunciationHint": "Use the r-colored vowel /ɝː/ in US English.",
        "exampleSentence": "This shirt fits me well.",
        "exampleJapanese": "このシャツは私によく合います。",
        "commonMistake": "A shirt normally has a collar or buttons; a T-shirt is different.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "clothing"
      },
      "icon": "👕",
      "tags": [
        "clothing",
        "level-13",
        "shirt"
      ]
    },
    "after_fields": {
      "title_en": "shirt",
      "title_ja": "シャツ",
      "content": {
        "word": "shirt",
        "japanese": "シャツ",
        "kanaReading": "シャート",
        "pronunciationHint": "Use the r-colored vowel /ɝː/ in US English.",
        "exampleSentence": "This shirt fits me well.",
        "exampleJapanese": "このシャツは私によく合います。",
        "commonMistake": "A shirt normally has a collar or buttons; a T-shirt is different.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-98dba1fd60066801.svg",
          "kind": "single",
          "altEn": "An illustration of shirt.",
          "altJa": "シャツのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "clothing"
      },
      "icon": "",
      "tags": [
        "clothing",
        "level-13",
        "shirt"
      ]
    }
  },
  {
    "id": "word-l13-pants",
    "category": "words",
    "level": 13,
    "before_fields": {
      "title_en": "pants",
      "title_ja": "ズボン",
      "content": {
        "word": "pants",
        "japanese": "ズボン",
        "kanaReading": "パンツ",
        "pronunciationHint": "Use /æ/ and finish with /nts/.",
        "exampleSentence": "These pants are too long.",
        "exampleJapanese": "このズボンは長すぎます。",
        "commonMistake": "“Pants” is plural in form: say “these pants.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "clothing"
      },
      "icon": "👖",
      "tags": [
        "clothing",
        "level-13",
        "pants"
      ]
    },
    "after_fields": {
      "title_en": "pants",
      "title_ja": "ズボン",
      "content": {
        "word": "pants",
        "japanese": "ズボン",
        "kanaReading": "パンツ",
        "pronunciationHint": "Use /æ/ and finish with /nts/.",
        "exampleSentence": "These pants are too long.",
        "exampleJapanese": "このズボンは長すぎます。",
        "commonMistake": "US “pants” means trousers; UK “pants” usually means underwear. For this item, practise the US clothing meaning: “these pants.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-6b845f7092517347.svg",
          "kind": "single",
          "altEn": "An illustration of pants.",
          "altJa": "ズボンのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "clothing"
      },
      "icon": "",
      "tags": [
        "clothing",
        "level-13",
        "pants"
      ]
    }
  },
  {
    "id": "word-l13-dress",
    "category": "words",
    "level": 13,
    "before_fields": {
      "title_en": "dress",
      "title_ja": "ワンピース・ドレス",
      "content": {
        "word": "dress",
        "japanese": "ワンピース・ドレス",
        "kanaReading": "ドレス",
        "pronunciationHint": "Finish with a clear /s/.",
        "exampleSentence": "She wore a blue dress.",
        "exampleJapanese": "彼女は青いワンピースを着ていました。",
        "commonMistake": "English “dress” is not every type of clothing.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "clothing"
      },
      "icon": "👗",
      "tags": [
        "clothing",
        "level-13",
        "dress"
      ]
    },
    "after_fields": {
      "title_en": "dress",
      "title_ja": "ワンピース・ドレス",
      "content": {
        "word": "dress",
        "japanese": "ワンピース・ドレス",
        "kanaReading": "ドレス",
        "pronunciationHint": "Finish with a clear /s/.",
        "exampleSentence": "She wore a blue dress.",
        "exampleJapanese": "彼女は青いワンピースを着ていました。",
        "commonMistake": "English “dress” is not every type of clothing.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-9491ea3c26bcbf5f.svg",
          "kind": "single",
          "altEn": "An illustration of dress.",
          "altJa": "ワンピース・ドレスのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "clothing"
      },
      "icon": "",
      "tags": [
        "clothing",
        "level-13",
        "dress"
      ]
    }
  },
  {
    "id": "word-l13-skirt",
    "category": "words",
    "level": 13,
    "before_fields": {
      "title_en": "skirt",
      "title_ja": "スカート",
      "content": {
        "word": "skirt",
        "japanese": "スカート",
        "kanaReading": "スカート",
        "pronunciationHint": "Blend /sk/ and keep the final t.",
        "exampleSentence": "This skirt has two pockets.",
        "exampleJapanese": "このスカートにはポケットが2つあります。",
        "commonMistake": "Do not drop the final t.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "clothing"
      },
      "icon": "🩱",
      "tags": [
        "clothing",
        "level-13",
        "skirt"
      ]
    },
    "after_fields": {
      "title_en": "skirt",
      "title_ja": "スカート",
      "content": {
        "word": "skirt",
        "japanese": "スカート",
        "kanaReading": "スカート",
        "pronunciationHint": "Blend /sk/ and keep the final t.",
        "exampleSentence": "This skirt has two pockets.",
        "exampleJapanese": "このスカートにはポケットが2つあります。",
        "commonMistake": "Do not drop the final t.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-23410ab39d189a6d.svg",
          "kind": "single",
          "altEn": "An illustration of skirt.",
          "altJa": "スカートのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "clothing"
      },
      "icon": "",
      "tags": [
        "clothing",
        "level-13",
        "skirt"
      ]
    }
  },
  {
    "id": "word-l13-shoes",
    "category": "words",
    "level": 13,
    "before_fields": {
      "title_en": "shoes",
      "title_ja": "靴",
      "content": {
        "word": "shoes",
        "japanese": "靴",
        "kanaReading": "シューズ",
        "pronunciationHint": "Finish with a voiced /z/.",
        "exampleSentence": "Please leave your shoes by the door.",
        "exampleJapanese": "靴をドアのそばに置いてください。",
        "commonMistake": "Use the plural “shoes” for a pair.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "clothing"
      },
      "icon": "👟",
      "tags": [
        "clothing",
        "level-13",
        "shoes"
      ]
    },
    "after_fields": {
      "title_en": "shoes",
      "title_ja": "靴",
      "content": {
        "word": "shoes",
        "japanese": "靴",
        "kanaReading": "シューズ",
        "pronunciationHint": "Finish with a voiced /z/.",
        "exampleSentence": "Please leave your shoes by the door.",
        "exampleJapanese": "靴をドアのそばに置いてください。",
        "commonMistake": "Use the plural “shoes” for a pair.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b012ac1f2ab7f3e5.svg",
          "kind": "single",
          "altEn": "An illustration of shoes.",
          "altJa": "靴のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "clothing"
      },
      "icon": "",
      "tags": [
        "clothing",
        "level-13",
        "shoes"
      ]
    }
  },
  {
    "id": "word-l13-socks",
    "category": "words",
    "level": 13,
    "before_fields": {
      "title_en": "socks",
      "title_ja": "靴下",
      "content": {
        "word": "socks",
        "japanese": "靴下",
        "kanaReading": "ソックス",
        "pronunciationHint": "Finish with the /ks/ cluster.",
        "exampleSentence": "My socks are still wet.",
        "exampleJapanese": "靴下はまだぬれています。",
        "commonMistake": "Use “a pair of socks,” not “a socks.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "clothing"
      },
      "icon": "🧦",
      "tags": [
        "clothing",
        "level-13",
        "socks"
      ]
    },
    "after_fields": {
      "title_en": "socks",
      "title_ja": "靴下",
      "content": {
        "word": "socks",
        "japanese": "靴下",
        "kanaReading": "ソックス",
        "pronunciationHint": "Finish with the /ks/ cluster.",
        "exampleSentence": "My socks are still wet.",
        "exampleJapanese": "靴下はまだぬれています。",
        "commonMistake": "Use “a pair of socks,” not “a socks.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f6b92ede180efc24.svg",
          "kind": "single",
          "altEn": "An illustration of socks.",
          "altJa": "靴下のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "clothing"
      },
      "icon": "",
      "tags": [
        "clothing",
        "level-13",
        "socks"
      ]
    }
  },
  {
    "id": "word-l13-hat",
    "category": "words",
    "level": 13,
    "before_fields": {
      "title_en": "hat",
      "title_ja": "帽子",
      "content": {
        "word": "hat",
        "japanese": "帽子",
        "kanaReading": "ハット",
        "pronunciationHint": "Use the open /æ/ vowel.",
        "exampleSentence": "Take your hat off indoors.",
        "exampleJapanese": "室内では帽子を取ってください。",
        "commonMistake": "“Hat” usually has a brim or shaped crown; “cap” is more specific.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "clothing"
      },
      "icon": "🎩",
      "tags": [
        "clothing",
        "level-13",
        "hat"
      ]
    },
    "after_fields": {
      "title_en": "hat",
      "title_ja": "帽子",
      "content": {
        "word": "hat",
        "japanese": "帽子",
        "kanaReading": "ハット",
        "pronunciationHint": "Use the open /æ/ vowel.",
        "exampleSentence": "Take your hat off indoors.",
        "exampleJapanese": "室内では帽子を取ってください。",
        "commonMistake": "“Hat” usually has a brim or shaped crown; “cap” is more specific.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7af3804c82a40908.svg",
          "kind": "single",
          "altEn": "An illustration of hat.",
          "altJa": "帽子のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "clothing"
      },
      "icon": "",
      "tags": [
        "clothing",
        "level-13",
        "hat"
      ]
    }
  },
  {
    "id": "word-l13-coat",
    "category": "words",
    "level": 13,
    "before_fields": {
      "title_en": "coat",
      "title_ja": "コート・上着",
      "content": {
        "word": "coat",
        "japanese": "コート・上着",
        "kanaReading": "コウト",
        "pronunciationHint": "Use /oʊ/ and keep the final t.",
        "exampleSentence": "Bring a warm coat tonight.",
        "exampleJapanese": "今夜は暖かいコートを持ってきてください。",
        "commonMistake": "Do not drop the final t.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "clothing"
      },
      "icon": "🧥",
      "tags": [
        "clothing",
        "level-13",
        "coat"
      ]
    },
    "after_fields": {
      "title_en": "coat",
      "title_ja": "コート・上着",
      "content": {
        "word": "coat",
        "japanese": "コート・上着",
        "kanaReading": "コウト",
        "pronunciationHint": "Use /oʊ/ and keep the final t.",
        "exampleSentence": "Bring a warm coat tonight.",
        "exampleJapanese": "今夜は暖かいコートを持ってきてください。",
        "commonMistake": "Do not drop the final t.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-6d8d7c005423c3ea.svg",
          "kind": "single",
          "altEn": "An illustration of coat.",
          "altJa": "コート・上着のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "clothing"
      },
      "icon": "",
      "tags": [
        "clothing",
        "level-13",
        "coat"
      ]
    }
  },
  {
    "id": "word-l13-gloves",
    "category": "words",
    "level": 13,
    "before_fields": {
      "title_en": "gloves",
      "title_ja": "手袋",
      "content": {
        "word": "gloves",
        "japanese": "手袋",
        "kanaReading": "グラヴズ",
        "pronunciationHint": "Finish with the voiced /vz/ cluster.",
        "exampleSentence": "I need gloves for the snow.",
        "exampleJapanese": "雪の日には手袋が必要です。",
        "commonMistake": "Use the plural for the usual pair.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "clothing"
      },
      "icon": "🧤",
      "tags": [
        "clothing",
        "level-13",
        "gloves"
      ]
    },
    "after_fields": {
      "title_en": "gloves",
      "title_ja": "手袋",
      "content": {
        "word": "gloves",
        "japanese": "手袋",
        "kanaReading": "グラヴズ",
        "pronunciationHint": "Finish with the voiced /vz/ cluster.",
        "exampleSentence": "I need gloves for the snow.",
        "exampleJapanese": "雪の日には手袋が必要です。",
        "commonMistake": "Use the plural for the usual pair.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-6bd5513e3562335a.svg",
          "kind": "single",
          "altEn": "An illustration of gloves.",
          "altJa": "手袋のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "clothing"
      },
      "icon": "",
      "tags": [
        "clothing",
        "level-13",
        "gloves"
      ]
    }
  },
  {
    "id": "word-l13-umbrella",
    "category": "words",
    "level": 13,
    "before_fields": {
      "title_en": "umbrella",
      "title_ja": "傘",
      "content": {
        "word": "umbrella",
        "japanese": "傘",
        "kanaReading": "アンブレラ",
        "pronunciationHint": "Stress BREL: um-BREL-la.",
        "exampleSentence": "I left my umbrella on the train.",
        "exampleJapanese": "電車に傘を忘れました。",
        "commonMistake": "Use “an umbrella,” not “a umbrella.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "clothing"
      },
      "icon": "☂️",
      "tags": [
        "clothing",
        "level-13",
        "umbrella"
      ]
    },
    "after_fields": {
      "title_en": "umbrella",
      "title_ja": "傘",
      "content": {
        "word": "umbrella",
        "japanese": "傘",
        "kanaReading": "アンブレラ",
        "pronunciationHint": "Stress BREL: um-BREL-la.",
        "exampleSentence": "I left my umbrella on the train.",
        "exampleJapanese": "電車に傘を忘れました。",
        "commonMistake": "Use “an umbrella,” not “a umbrella.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-0603582b8e907cea.svg",
          "kind": "single",
          "altEn": "An illustration of umbrella.",
          "altJa": "傘のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "clothing"
      },
      "icon": "",
      "tags": [
        "clothing",
        "level-13",
        "umbrella"
      ]
    }
  },
  {
    "id": "word-l14-car",
    "category": "words",
    "level": 14,
    "before_fields": {
      "title_en": "car",
      "title_ja": "車",
      "content": {
        "word": "car",
        "japanese": "車",
        "kanaReading": "カー",
        "pronunciationHint": "Use a strong r in US English and a long vowel in UK English.",
        "exampleSentence": "We rented a small car.",
        "exampleJapanese": "私たちは小型車を借りました。",
        "commonMistake": "Say “by car,” but “in the car.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "transport-and-travel"
      },
      "icon": "🚗",
      "tags": [
        "transport-and-travel",
        "level-14",
        "car"
      ]
    },
    "after_fields": {
      "title_en": "car",
      "title_ja": "車",
      "content": {
        "word": "car",
        "japanese": "車",
        "kanaReading": "カー",
        "pronunciationHint": "Use a strong r in US English and a long vowel in UK English.",
        "exampleSentence": "We rented a small car.",
        "exampleJapanese": "私たちは小型車を借りました。",
        "commonMistake": "Say “by car,” but “in the car.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-04674275c47a5d19.svg",
          "kind": "single",
          "altEn": "An illustration of car.",
          "altJa": "車のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "transport-and-travel"
      },
      "icon": "",
      "tags": [
        "transport-and-travel",
        "level-14",
        "car"
      ]
    }
  },
  {
    "id": "word-l14-bus",
    "category": "words",
    "level": 14,
    "before_fields": {
      "title_en": "bus",
      "title_ja": "バス",
      "content": {
        "word": "bus",
        "japanese": "バス",
        "kanaReading": "バス",
        "pronunciationHint": "Use the short /ʌ/ vowel and final /s/.",
        "exampleSentence": "The bus comes every twenty minutes.",
        "exampleJapanese": "そのバスは20分ごとに来ます。",
        "commonMistake": "The plural is “buses,” not “bus.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "transport-and-travel"
      },
      "icon": "🚌",
      "tags": [
        "transport-and-travel",
        "level-14",
        "bus"
      ]
    },
    "after_fields": {
      "title_en": "bus",
      "title_ja": "バス",
      "content": {
        "word": "bus",
        "japanese": "バス",
        "kanaReading": "バス",
        "pronunciationHint": "Use the short /ʌ/ vowel and final /s/.",
        "exampleSentence": "The bus comes every twenty minutes.",
        "exampleJapanese": "そのバスは20分ごとに来ます。",
        "commonMistake": "The plural is “buses,” not “bus.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d816469842d7ffdc.svg",
          "kind": "single",
          "altEn": "An illustration of bus.",
          "altJa": "バスのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "transport-and-travel"
      },
      "icon": "",
      "tags": [
        "transport-and-travel",
        "level-14",
        "bus"
      ]
    }
  },
  {
    "id": "word-l14-train",
    "category": "words",
    "level": 14,
    "before_fields": {
      "title_en": "train",
      "title_ja": "電車",
      "content": {
        "word": "train",
        "japanese": "電車",
        "kanaReading": "トレイン",
        "pronunciationHint": "Blend /tr/ and use /eɪ/.",
        "exampleSentence": "I caught the last train home.",
        "exampleJapanese": "最終電車で帰りました。",
        "commonMistake": "Say “by train,” but “on the train.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "transport-and-travel"
      },
      "icon": "🚆",
      "tags": [
        "transport-and-travel",
        "level-14",
        "train"
      ]
    },
    "after_fields": {
      "title_en": "train",
      "title_ja": "電車",
      "content": {
        "word": "train",
        "japanese": "電車",
        "kanaReading": "トレイン",
        "pronunciationHint": "Blend /tr/ and use /eɪ/.",
        "exampleSentence": "I caught the last train home.",
        "exampleJapanese": "最終電車で帰りました。",
        "commonMistake": "Say “by train,” but “on the train.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7df66b0f8c4e1080.svg",
          "kind": "single",
          "altEn": "An illustration of train.",
          "altJa": "電車のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "transport-and-travel"
      },
      "icon": "",
      "tags": [
        "transport-and-travel",
        "level-14",
        "train"
      ]
    }
  },
  {
    "id": "word-l14-bicycle",
    "category": "words",
    "level": 14,
    "before_fields": {
      "title_en": "bicycle",
      "title_ja": "自転車",
      "content": {
        "word": "bicycle",
        "japanese": "自転車",
        "kanaReading": "バイシクル",
        "pronunciationHint": "Stress BI and make the middle c sound /s/.",
        "exampleSentence": "He rides his bicycle to work.",
        "exampleJapanese": "彼は自転車で通勤します。",
        "commonMistake": "“Ride a bicycle,” not “drive a bicycle.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "transport-and-travel"
      },
      "icon": "🚲",
      "tags": [
        "transport-and-travel",
        "level-14",
        "bicycle"
      ]
    },
    "after_fields": {
      "title_en": "bicycle",
      "title_ja": "自転車",
      "content": {
        "word": "bicycle",
        "japanese": "自転車",
        "kanaReading": "バイシクル",
        "pronunciationHint": "Stress BI and make the middle c sound /s/.",
        "exampleSentence": "He rides his bicycle to work.",
        "exampleJapanese": "彼は自転車で通勤します。",
        "commonMistake": "“Ride a bicycle,” not “drive a bicycle.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-8370b5656e9c4570.svg",
          "kind": "single",
          "altEn": "An illustration of bicycle.",
          "altJa": "自転車のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "transport-and-travel"
      },
      "icon": "",
      "tags": [
        "transport-and-travel",
        "level-14",
        "bicycle"
      ]
    }
  },
  {
    "id": "word-l14-airplane",
    "category": "words",
    "level": 14,
    "before_fields": {
      "title_en": "airplane",
      "title_ja": "飛行機",
      "content": {
        "word": "airplane",
        "japanese": "飛行機",
        "kanaReading": "エアプレイン",
        "pronunciationHint": "Stress AIR and connect both parts.",
        "exampleSentence": "The airplane landed safely.",
        "exampleJapanese": "飛行機は無事に着陸しました。",
        "commonMistake": "Use “on the airplane,” not “in airplane.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "transport-and-travel"
      },
      "icon": "✈️",
      "tags": [
        "transport-and-travel",
        "level-14",
        "airplane"
      ]
    },
    "after_fields": {
      "title_en": "airplane",
      "title_ja": "飛行機",
      "content": {
        "word": "airplane",
        "japanese": "飛行機",
        "kanaReading": "エアプレイン",
        "pronunciationHint": "Stress AIR and connect both parts.",
        "exampleSentence": "The airplane landed safely.",
        "exampleJapanese": "飛行機は無事に着陸しました。",
        "commonMistake": "Use “on the airplane,” not “in airplane.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-66899dd335b3e92b.svg",
          "kind": "single",
          "altEn": "An illustration of airplane.",
          "altJa": "飛行機のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "transport-and-travel"
      },
      "icon": "",
      "tags": [
        "transport-and-travel",
        "level-14",
        "airplane"
      ]
    }
  },
  {
    "id": "word-l14-taxi",
    "category": "words",
    "level": 14,
    "before_fields": {
      "title_en": "taxi",
      "title_ja": "タクシー",
      "content": {
        "word": "taxi",
        "japanese": "タクシー",
        "kanaReading": "タクシー",
        "pronunciationHint": "Stress TAX and use /ks/.",
        "exampleSentence": "Let us take a taxi to the hotel.",
        "exampleJapanese": "ホテルまでタクシーで行きましょう。",
        "commonMistake": "Say “take a taxi,” not “ride taxi.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "transport-and-travel"
      },
      "icon": "🚕",
      "tags": [
        "transport-and-travel",
        "level-14",
        "taxi"
      ]
    },
    "after_fields": {
      "title_en": "taxi",
      "title_ja": "タクシー",
      "content": {
        "word": "taxi",
        "japanese": "タクシー",
        "kanaReading": "タクシー",
        "pronunciationHint": "Stress TAX and use /ks/.",
        "exampleSentence": "Let us take a taxi to the hotel.",
        "exampleJapanese": "ホテルまでタクシーで行きましょう。",
        "commonMistake": "Say “take a taxi,” not “ride taxi.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f61876d9db0dd63a.svg",
          "kind": "single",
          "altEn": "An illustration of taxi.",
          "altJa": "タクシーのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "transport-and-travel"
      },
      "icon": "",
      "tags": [
        "transport-and-travel",
        "level-14",
        "taxi"
      ]
    }
  },
  {
    "id": "word-l14-boat",
    "category": "words",
    "level": 14,
    "before_fields": {
      "title_en": "boat",
      "title_ja": "ボート",
      "content": {
        "word": "boat",
        "japanese": "ボート",
        "kanaReading": "ボウト",
        "pronunciationHint": "Use /oʊ/ and finish with t.",
        "exampleSentence": "We crossed the lake by boat.",
        "exampleJapanese": "私たちはボートで湖を渡りました。",
        "commonMistake": "Do not drop the final t.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "transport-and-travel"
      },
      "icon": "⛵",
      "tags": [
        "transport-and-travel",
        "level-14",
        "boat"
      ]
    },
    "after_fields": {
      "title_en": "boat",
      "title_ja": "ボート",
      "content": {
        "word": "boat",
        "japanese": "ボート",
        "kanaReading": "ボウト",
        "pronunciationHint": "Use /oʊ/ and finish with t.",
        "exampleSentence": "We crossed the lake by boat.",
        "exampleJapanese": "私たちはボートで湖を渡りました。",
        "commonMistake": "Do not drop the final t.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-aec008830703ce92.svg",
          "kind": "single",
          "altEn": "An illustration of boat.",
          "altJa": "ボートのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "transport-and-travel"
      },
      "icon": "",
      "tags": [
        "transport-and-travel",
        "level-14",
        "boat"
      ]
    }
  },
  {
    "id": "word-l14-ticket",
    "category": "words",
    "level": 14,
    "before_fields": {
      "title_en": "ticket",
      "title_ja": "切符・チケット",
      "content": {
        "word": "ticket",
        "japanese": "切符・チケット",
        "kanaReading": "ティケット",
        "pronunciationHint": "Stress TICK; the second vowel is weak.",
        "exampleSentence": "Keep your ticket until you leave.",
        "exampleJapanese": "出るまで切符を持っていてください。",
        "commonMistake": "Say “a ticket to Tokyo,” not “a ticket for Tokyo” when naming a destination.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "transport-and-travel"
      },
      "icon": "🎫",
      "tags": [
        "transport-and-travel",
        "level-14",
        "ticket"
      ]
    },
    "after_fields": {
      "title_en": "ticket",
      "title_ja": "切符・チケット",
      "content": {
        "word": "ticket",
        "japanese": "切符・チケット",
        "kanaReading": "ティケット",
        "pronunciationHint": "Stress TICK; the second vowel is weak.",
        "exampleSentence": "Keep your ticket until you leave.",
        "exampleJapanese": "出るまで切符を持っていてください。",
        "commonMistake": "Use “a ticket to Tokyo” for the destination, and “a ticket for the ten o’clock train” for a particular service.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-15fba32e3cd75ae8.svg",
          "kind": "scene",
          "altEn": "A train ticket with an origin, destination, and departure time.",
          "altJa": "出発地・目的地・時刻が書かれた電車の切符。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "transport-and-travel"
      },
      "icon": "",
      "tags": [
        "transport-and-travel",
        "level-14",
        "ticket"
      ]
    }
  },
  {
    "id": "word-l14-map",
    "category": "words",
    "level": 14,
    "before_fields": {
      "title_en": "map",
      "title_ja": "地図",
      "content": {
        "word": "map",
        "japanese": "地図",
        "kanaReading": "マップ",
        "pronunciationHint": "Use the open /æ/ vowel.",
        "exampleSentence": "The map shows a shorter route.",
        "exampleJapanese": "その地図にはもっと短い道が載っています。",
        "commonMistake": "Say “on the map,” not “in the map.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "transport-and-travel"
      },
      "icon": "🗺️",
      "tags": [
        "transport-and-travel",
        "level-14",
        "map"
      ]
    },
    "after_fields": {
      "title_en": "map",
      "title_ja": "地図",
      "content": {
        "word": "map",
        "japanese": "地図",
        "kanaReading": "マップ",
        "pronunciationHint": "Use the open /æ/ vowel.",
        "exampleSentence": "The map shows a shorter route.",
        "exampleJapanese": "その地図にはもっと短い道が載っています。",
        "commonMistake": "Say “on the map,” not “in the map.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c24b61d810eb7308.svg",
          "kind": "scene",
          "altEn": "A map shows roads linking a house, school, and park.",
          "altJa": "家・学校・公園を道路で結ぶ地図。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "transport-and-travel"
      },
      "icon": "",
      "tags": [
        "transport-and-travel",
        "level-14",
        "map"
      ]
    }
  },
  {
    "id": "word-l14-trip",
    "category": "words",
    "level": 14,
    "before_fields": {
      "title_en": "trip",
      "title_ja": "旅行",
      "content": {
        "word": "trip",
        "japanese": "旅行",
        "kanaReading": "トリップ",
        "pronunciationHint": "Blend /tr/ and use short /ɪ/.",
        "exampleSentence": "Our class trip was fun.",
        "exampleJapanese": "修学旅行は楽しかったです。",
        "commonMistake": "Use “trip” for the whole journey; “travel” is usually uncountable.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "transport-and-travel"
      },
      "icon": "🧳",
      "tags": [
        "transport-and-travel",
        "level-14",
        "trip"
      ]
    },
    "after_fields": {
      "title_en": "trip",
      "title_ja": "旅行",
      "content": {
        "word": "trip",
        "japanese": "旅行",
        "kanaReading": "トリップ",
        "pronunciationHint": "Blend /tr/ and use short /ɪ/.",
        "exampleSentence": "Our class trip was fun.",
        "exampleJapanese": "修学旅行は楽しかったです。",
        "commonMistake": "Use “trip” for the whole journey; “travel” is usually uncountable.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-532bc7fb59794b90.svg",
          "kind": "sequence",
          "altEn": "Someone packs a suitcase, travels by train, and arrives at a new place.",
          "altJa": "荷造りをして電車に乗り、旅行先に着く流れ。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "transport-and-travel"
      },
      "icon": "",
      "tags": [
        "transport-and-travel",
        "level-14",
        "trip"
      ]
    }
  },
  {
    "id": "word-l15-clean",
    "category": "words",
    "level": 15,
    "before_fields": {
      "title_en": "clean",
      "title_ja": "掃除する・清潔な",
      "content": {
        "word": "clean",
        "japanese": "掃除する・清潔な",
        "kanaReading": "クリーン",
        "pronunciationHint": "Blend /kl/ and hold /iː/.",
        "exampleSentence": "I clean the kitchen after dinner.",
        "exampleJapanese": "夕食後に台所を掃除します。",
        "commonMistake": "Use “clean” without “up” when removing dirt generally.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "chores-and-practical-actions"
      },
      "icon": "🧽",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "clean"
      ]
    },
    "after_fields": {
      "title_en": "clean",
      "title_ja": "掃除する・清潔な",
      "content": {
        "word": "clean",
        "japanese": "掃除する・清潔な",
        "kanaReading": "クリーン",
        "pronunciationHint": "Blend /kl/ and hold /iː/.",
        "exampleSentence": "I clean the kitchen after dinner.",
        "exampleJapanese": "夕食後に台所を掃除します。",
        "commonMistake": "“Clean the kitchen” focuses on making it clean. “Clean up the kitchen” can also include tidying it.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-10badc652de00f68.svg",
          "kind": "single",
          "altEn": "An illustration of clean.",
          "altJa": "掃除する・清潔なのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "chores-and-practical-actions"
      },
      "icon": "",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "clean"
      ]
    }
  },
  {
    "id": "word-l15-wash",
    "category": "words",
    "level": 15,
    "before_fields": {
      "title_en": "wash",
      "title_ja": "洗う",
      "content": {
        "word": "wash",
        "japanese": "洗う",
        "kanaReading": "ウォッシュ",
        "pronunciationHint": "Finish with /ʃ/.",
        "exampleSentence": "Wash your hands before eating.",
        "exampleJapanese": "食べる前に手を洗ってください。",
        "commonMistake": "Use “wash” with water; “clean” is broader.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "chores-and-practical-actions"
      },
      "icon": "🧼",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "wash"
      ]
    },
    "after_fields": {
      "title_en": "wash",
      "title_ja": "洗う",
      "content": {
        "word": "wash",
        "japanese": "洗う",
        "kanaReading": "ウォッシュ",
        "pronunciationHint": "Finish with /ʃ/.",
        "exampleSentence": "Wash your hands before eating.",
        "exampleJapanese": "食べる前に手を洗ってください。",
        "commonMistake": "Use “wash” with water; “clean” is broader.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b89f3674a5287c6f.svg",
          "kind": "single",
          "altEn": "An illustration of wash.",
          "altJa": "洗うのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "chores-and-practical-actions"
      },
      "icon": "",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "wash"
      ]
    }
  },
  {
    "id": "word-l15-cook",
    "category": "words",
    "level": 15,
    "before_fields": {
      "title_en": "cook",
      "title_ja": "料理する",
      "content": {
        "word": "cook",
        "japanese": "料理する",
        "kanaReading": "クック",
        "pronunciationHint": "Use short /ʊ/, not long /uː/.",
        "exampleSentence": "Can you cook rice for four people?",
        "exampleJapanese": "4人分のご飯を炊けますか。",
        "commonMistake": "“Cook” is the action; “a cook” is a person.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "chores-and-practical-actions"
      },
      "icon": "🍳",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "cook"
      ]
    },
    "after_fields": {
      "title_en": "cook",
      "title_ja": "料理する",
      "content": {
        "word": "cook",
        "japanese": "料理する",
        "kanaReading": "クック",
        "pronunciationHint": "Use short /ʊ/, not long /uː/.",
        "exampleSentence": "Can you cook rice for four people?",
        "exampleJapanese": "4人分のご飯を炊けますか。",
        "commonMistake": "“Cook” is the action; “a cook” is a person.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-52296a2aa989e4f9.svg",
          "kind": "single",
          "altEn": "An illustration of cook.",
          "altJa": "料理するのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "chores-and-practical-actions"
      },
      "icon": "",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "cook"
      ]
    }
  },
  {
    "id": "word-l15-sweep",
    "category": "words",
    "level": 15,
    "before_fields": {
      "title_en": "sweep",
      "title_ja": "掃く",
      "content": {
        "word": "sweep",
        "japanese": "掃く",
        "kanaReading": "スウィープ",
        "pronunciationHint": "Blend /sw/ and hold /iː/.",
        "exampleSentence": "Please sweep the floor before guests arrive.",
        "exampleJapanese": "お客さんが来る前に床を掃いてください。",
        "commonMistake": "The past form is “swept,” not “sweeped.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "chores-and-practical-actions"
      },
      "icon": "🧹",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "sweep"
      ]
    },
    "after_fields": {
      "title_en": "sweep",
      "title_ja": "掃く",
      "content": {
        "word": "sweep",
        "japanese": "掃く",
        "kanaReading": "スウィープ",
        "pronunciationHint": "Blend /sw/ and hold /iː/.",
        "exampleSentence": "Please sweep the floor before guests arrive.",
        "exampleJapanese": "お客さんが来る前に床を掃いてください。",
        "commonMistake": "The past form is “swept,” not “sweeped.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5dba95cbeeb39431.svg",
          "kind": "scene",
          "altEn": "A broom sweeps loose dirt into a small pile.",
          "altJa": "ほうきで床のごみを一か所に掃き集めています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "chores-and-practical-actions"
      },
      "icon": "",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "sweep"
      ]
    }
  },
  {
    "id": "word-l15-carry",
    "category": "words",
    "level": 15,
    "before_fields": {
      "title_en": "carry",
      "title_ja": "運ぶ・持ち歩く",
      "content": {
        "word": "carry",
        "japanese": "運ぶ・持ち歩く",
        "kanaReading": "キャリー",
        "pronunciationHint": "Stress CAR; the final y is /i/.",
        "exampleSentence": "Could you carry this box upstairs?",
        "exampleJapanese": "この箱を2階まで運んでもらえますか。",
        "commonMistake": "Do not use “bring” when the direction is away from the speaker.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "chores-and-practical-actions"
      },
      "icon": "📦",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "carry"
      ]
    },
    "after_fields": {
      "title_en": "carry",
      "title_ja": "運ぶ・持ち歩く",
      "content": {
        "word": "carry",
        "japanese": "運ぶ・持ち歩く",
        "kanaReading": "キャリー",
        "pronunciationHint": "Stress CAR; the final y is /i/.",
        "exampleSentence": "Could you carry this box upstairs?",
        "exampleJapanese": "この箱を2階まで運んでもらえますか。",
        "commonMistake": "“Carry” describes holding and moving something. “Bring” and “take” also tell us about the direction of movement.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-2260402c17253d51.svg",
          "kind": "single",
          "altEn": "An illustration of carry.",
          "altJa": "運ぶ・持ち歩くのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "chores-and-practical-actions"
      },
      "icon": "",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "carry"
      ]
    }
  },
  {
    "id": "word-l15-fix",
    "category": "words",
    "level": 15,
    "before_fields": {
      "title_en": "fix",
      "title_ja": "直す・固定する",
      "content": {
        "word": "fix",
        "japanese": "直す・固定する",
        "kanaReading": "フィックス",
        "pronunciationHint": "Finish with /ks/.",
        "exampleSentence": "I need to fix the loose handle.",
        "exampleJapanese": "緩んだ取っ手を直す必要があります。",
        "commonMistake": "Use “fix” for repair, not every kind of problem-solving in formal writing.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "chores-and-practical-actions"
      },
      "icon": "🔧",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "fix"
      ]
    },
    "after_fields": {
      "title_en": "fix",
      "title_ja": "直す・固定する",
      "content": {
        "word": "fix",
        "japanese": "直す・固定する",
        "kanaReading": "フィックス",
        "pronunciationHint": "Finish with /ks/.",
        "exampleSentence": "I need to fix the loose handle.",
        "exampleJapanese": "緩んだ取っ手を直す必要があります。",
        "commonMistake": "Use “fix” directly with the problem or broken object: “fix the handle,” not “fix to the handle.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-a2f75f8488c55b7d.svg",
          "kind": "scene",
          "altEn": "Tools repair a loose part of a car.",
          "altJa": "工具を使って車の緩んだ部分を直しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "chores-and-practical-actions"
      },
      "icon": "",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "fix"
      ]
    }
  },
  {
    "id": "word-l15-borrow",
    "category": "words",
    "level": 15,
    "before_fields": {
      "title_en": "borrow",
      "title_ja": "借りる",
      "content": {
        "word": "borrow",
        "japanese": "借りる",
        "kanaReading": "ボロウ",
        "pronunciationHint": "Stress BOR; the ending is weak.",
        "exampleSentence": "May I borrow your charger?",
        "exampleJapanese": "充電器を借りてもいいですか。",
        "commonMistake": "“Borrow” means receive temporarily; “lend” means give temporarily.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "chores-and-practical-actions"
      },
      "icon": "🤲",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "borrow"
      ]
    },
    "after_fields": {
      "title_en": "borrow",
      "title_ja": "借りる",
      "content": {
        "word": "borrow",
        "japanese": "借りる",
        "kanaReading": "ボロウ",
        "pronunciationHint": "Stress BOR; the ending is weak.",
        "exampleSentence": "May I borrow your charger?",
        "exampleJapanese": "充電器を借りてもいいですか。",
        "commonMistake": "“Borrow” means receive temporarily; “lend” means give temporarily.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-e3ef5a57c918b7d7.svg",
          "kind": "sequence",
          "altEn": "A book is lent for a short time and then returned.",
          "altJa": "本をしばらく借りてから返す流れ。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "chores-and-practical-actions"
      },
      "icon": "",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "borrow"
      ]
    }
  },
  {
    "id": "word-l15-return",
    "category": "words",
    "level": 15,
    "before_fields": {
      "title_en": "return",
      "title_ja": "返す・戻る",
      "content": {
        "word": "return",
        "japanese": "返す・戻る",
        "kanaReading": "リターン",
        "pronunciationHint": "Stress TURN.",
        "exampleSentence": "Please return the key by Friday.",
        "exampleJapanese": "金曜日までに鍵を返してください。",
        "commonMistake": "Use “return the key,” not “return back the key.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "chores-and-practical-actions"
      },
      "icon": "↩️",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "return"
      ]
    },
    "after_fields": {
      "title_en": "return",
      "title_ja": "返す・戻る",
      "content": {
        "word": "return",
        "japanese": "返す・戻る",
        "kanaReading": "リターン",
        "pronunciationHint": "Stress TURN.",
        "exampleSentence": "Please return the key by Friday.",
        "exampleJapanese": "金曜日までに鍵を返してください。",
        "commonMistake": "Use “return the key,” not “return back the key.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-915c0cd0c7e0fbc2.svg",
          "kind": "single",
          "altEn": "An illustration of return.",
          "altJa": "返す・戻るのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "chores-and-practical-actions"
      },
      "icon": "",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "return"
      ]
    }
  },
  {
    "id": "word-l15-choose",
    "category": "words",
    "level": 15,
    "before_fields": {
      "title_en": "choose",
      "title_ja": "選ぶ",
      "content": {
        "word": "choose",
        "japanese": "選ぶ",
        "kanaReading": "チューズ",
        "pronunciationHint": "Use /tʃ/ and finish with voiced /z/.",
        "exampleSentence": "Choose the answer that sounds natural.",
        "exampleJapanese": "自然に聞こえる答えを選んでください。",
        "commonMistake": "The past form is “chose”; “chosen” needs an auxiliary.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "chores-and-practical-actions"
      },
      "icon": "✅",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "choose"
      ]
    },
    "after_fields": {
      "title_en": "choose",
      "title_ja": "選ぶ",
      "content": {
        "word": "choose",
        "japanese": "選ぶ",
        "kanaReading": "チューズ",
        "pronunciationHint": "Use /tʃ/ and finish with voiced /z/.",
        "exampleSentence": "Choose the answer that sounds natural.",
        "exampleJapanese": "自然に聞こえる答えを選んでください。",
        "commonMistake": "The past form is “chose”; “chosen” needs an auxiliary.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-da3c1208150c55ef.svg",
          "kind": "scene",
          "altEn": "A person points to one fruit from two available choices.",
          "altJa": "りんごとバナナの中から一つを指して選ぶ人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "chores-and-practical-actions"
      },
      "icon": "",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "choose"
      ]
    }
  },
  {
    "id": "word-l15-pack",
    "category": "words",
    "level": 15,
    "before_fields": {
      "title_en": "pack",
      "title_ja": "荷造りする",
      "content": {
        "word": "pack",
        "japanese": "荷造りする",
        "kanaReading": "パック",
        "pronunciationHint": "Use /æ/ and finish with k.",
        "exampleSentence": "I packed a light jacket for the trip.",
        "exampleJapanese": "旅行用に薄い上着を詰めました。",
        "commonMistake": "Say “pack a bag,” not “pack up a bag” unless emphasizing completion.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "chores-and-practical-actions"
      },
      "icon": "🧳",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "pack"
      ]
    },
    "after_fields": {
      "title_en": "pack",
      "title_ja": "荷造りする",
      "content": {
        "word": "pack",
        "japanese": "荷造りする",
        "kanaReading": "パック",
        "pronunciationHint": "Use /æ/ and finish with k.",
        "exampleSentence": "I packed a light jacket for the trip.",
        "exampleJapanese": "旅行用に薄い上着を詰めました。",
        "commonMistake": "“Pack a bag” means put things in it. “Pack up” can mean collect your things before leaving.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-cef98e0ef71eaf5c.svg",
          "kind": "single",
          "altEn": "An illustration of pack.",
          "altJa": "荷造りするのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "chores-and-practical-actions"
      },
      "icon": "",
      "tags": [
        "chores-and-practical-actions",
        "level-15",
        "pack"
      ]
    }
  },
  {
    "id": "word-l16-ask",
    "category": "words",
    "level": 16,
    "before_fields": {
      "title_en": "ask",
      "title_ja": "尋ねる・頼む",
      "content": {
        "word": "ask",
        "japanese": "尋ねる・頼む",
        "kanaReading": "アスク",
        "pronunciationHint": "Finish with the /sk/ cluster.",
        "exampleSentence": "Please ask if anything is unclear.",
        "exampleJapanese": "分からないことがあれば尋ねてください。",
        "commonMistake": "Use “ask someone a question,” not “ask a question to someone.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "communication"
      },
      "icon": "❓",
      "tags": [
        "communication",
        "level-16",
        "ask"
      ]
    },
    "after_fields": {
      "title_en": "ask",
      "title_ja": "尋ねる・頼む",
      "content": {
        "word": "ask",
        "japanese": "尋ねる・頼む",
        "kanaReading": "アスク",
        "pronunciationHint": "Finish with the /sk/ cluster.",
        "exampleSentence": "Please ask if anything is unclear.",
        "exampleJapanese": "分からないことがあれば尋ねてください。",
        "commonMistake": "The useful everyday pattern is “ask someone a question.” Use “ask for help” when you want assistance.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-0f72c7aa1ab0eef0.svg",
          "kind": "single",
          "altEn": "An illustration of ask.",
          "altJa": "尋ねる・頼むのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "communication"
      },
      "icon": "",
      "tags": [
        "communication",
        "level-16",
        "ask"
      ]
    }
  },
  {
    "id": "word-l16-answer",
    "category": "words",
    "level": 16,
    "before_fields": {
      "title_en": "answer",
      "title_ja": "答える・答え",
      "content": {
        "word": "answer",
        "japanese": "答える・答え",
        "kanaReading": "アンサー",
        "pronunciationHint": "The w is silent.",
        "exampleSentence": "Could you answer the final question?",
        "exampleJapanese": "最後の質問に答えてもらえますか。",
        "commonMistake": "Do not pronounce the written w.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "communication"
      },
      "icon": "💬",
      "tags": [
        "communication",
        "level-16",
        "answer"
      ]
    },
    "after_fields": {
      "title_en": "answer",
      "title_ja": "答える・答え",
      "content": {
        "word": "answer",
        "japanese": "答える・答え",
        "kanaReading": "アンサー",
        "pronunciationHint": "The w is silent.",
        "exampleSentence": "Could you answer the final question?",
        "exampleJapanese": "最後の質問に答えてもらえますか。",
        "commonMistake": "Do not pronounce the written w.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ea5a4125fc5b2f6b.svg",
          "kind": "single",
          "altEn": "An illustration of answer.",
          "altJa": "答える・答えのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "communication"
      },
      "icon": "",
      "tags": [
        "communication",
        "level-16",
        "answer"
      ]
    }
  },
  {
    "id": "word-l16-explain",
    "category": "words",
    "level": 16,
    "before_fields": {
      "title_en": "explain",
      "title_ja": "説明する",
      "content": {
        "word": "explain",
        "japanese": "説明する",
        "kanaReading": "イクスプレイン",
        "pronunciationHint": "Stress PLAIN and blend /kspl/.",
        "exampleSentence": "Can you explain that rule again?",
        "exampleJapanese": "そのルールをもう一度説明してもらえますか。",
        "commonMistake": "Say “explain it to me,” not “explain me it.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "communication"
      },
      "icon": "🧑‍🏫",
      "tags": [
        "communication",
        "level-16",
        "explain"
      ]
    },
    "after_fields": {
      "title_en": "explain",
      "title_ja": "説明する",
      "content": {
        "word": "explain",
        "japanese": "説明する",
        "kanaReading": "イクスプレイン",
        "pronunciationHint": "Stress PLAIN and blend /kspl/.",
        "exampleSentence": "Can you explain that rule again?",
        "exampleJapanese": "そのルールをもう一度説明してもらえますか。",
        "commonMistake": "Say “explain it to me,” not “explain me it.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5e6d264a0b96395f.svg",
          "kind": "scene",
          "altEn": "A teacher shows how puzzle pieces fit while a learner follows.",
          "altJa": "先生がパズルの仕組みを説明し、生徒が聞いています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "communication"
      },
      "icon": "",
      "tags": [
        "communication",
        "level-16",
        "explain"
      ]
    }
  },
  {
    "id": "word-l16-repeat",
    "category": "words",
    "level": 16,
    "before_fields": {
      "title_en": "repeat",
      "title_ja": "繰り返す",
      "content": {
        "word": "repeat",
        "japanese": "繰り返す",
        "kanaReading": "リピート",
        "pronunciationHint": "Stress the second syllable: re-PEAT.",
        "exampleSentence": "Please repeat the address slowly.",
        "exampleJapanese": "住所をもう一度ゆっくり言ってください。",
        "commonMistake": "Do not add “again” unless repetition needs extra emphasis.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "communication"
      },
      "icon": "🔁",
      "tags": [
        "communication",
        "level-16",
        "repeat"
      ]
    },
    "after_fields": {
      "title_en": "repeat",
      "title_ja": "繰り返す",
      "content": {
        "word": "repeat",
        "japanese": "繰り返す",
        "kanaReading": "リピート",
        "pronunciationHint": "Stress the second syllable: re-PEAT.",
        "exampleSentence": "Please repeat the address slowly.",
        "exampleJapanese": "住所をもう一度ゆっくり言ってください。",
        "commonMistake": "Say “repeat the word,” not “repeat to the word.” “Repeat it again” is possible when another repetition is needed.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5ba76cfcb6b40d2b.svg",
          "kind": "sequence",
          "altEn": "A speaker says the same short message twice to a listener.",
          "altJa": "話し手が聞き手に同じ短い言葉を二度伝えます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "communication"
      },
      "icon": "",
      "tags": [
        "communication",
        "level-16",
        "repeat"
      ]
    }
  },
  {
    "id": "word-l16-speak",
    "category": "words",
    "level": 16,
    "before_fields": {
      "title_en": "speak",
      "title_ja": "話す",
      "content": {
        "word": "speak",
        "japanese": "話す",
        "kanaReading": "スピーク",
        "pronunciationHint": "Blend /sp/ and hold /iː/.",
        "exampleSentence": "Could you speak a little more slowly?",
        "exampleJapanese": "もう少しゆっくり話してもらえますか。",
        "commonMistake": "Use “speak to someone,” not normally “speak someone.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "communication"
      },
      "icon": "🗣️",
      "tags": [
        "communication",
        "level-16",
        "speak"
      ]
    },
    "after_fields": {
      "title_en": "speak",
      "title_ja": "話す",
      "content": {
        "word": "speak",
        "japanese": "話す",
        "kanaReading": "スピーク",
        "pronunciationHint": "Blend /sp/ and hold /iː/.",
        "exampleSentence": "Could you speak a little more slowly?",
        "exampleJapanese": "もう少しゆっくり話してもらえますか。",
        "commonMistake": "Use “speak to someone,” not normally “speak someone.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-452fc75c0282e245.svg",
          "kind": "single",
          "altEn": "An illustration of speak.",
          "altJa": "話すのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "communication"
      },
      "icon": "",
      "tags": [
        "communication",
        "level-16",
        "speak"
      ]
    }
  },
  {
    "id": "word-l16-whisper",
    "category": "words",
    "level": 16,
    "before_fields": {
      "title_en": "whisper",
      "title_ja": "ささやく",
      "content": {
        "word": "whisper",
        "japanese": "ささやく",
        "kanaReading": "ウィスパー",
        "pronunciationHint": "The wh begins like /w/; stress WHIS.",
        "exampleSentence": "She whispered the answer to me.",
        "exampleJapanese": "彼女は私に答えをささやきました。",
        "commonMistake": "Say “whisper to someone,” not “whisper someone.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "communication"
      },
      "icon": "🤫",
      "tags": [
        "communication",
        "level-16",
        "whisper"
      ]
    },
    "after_fields": {
      "title_en": "whisper",
      "title_ja": "ささやく",
      "content": {
        "word": "whisper",
        "japanese": "ささやく",
        "kanaReading": "ウィスパー",
        "pronunciationHint": "The wh begins like /w/; stress WHIS.",
        "exampleSentence": "She whispered the answer to me.",
        "exampleJapanese": "彼女は私に答えをささやきました。",
        "commonMistake": "Say “whisper to someone,” not “whisper someone.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-88ef995c7ec9779a.svg",
          "kind": "single",
          "altEn": "An illustration of whisper.",
          "altJa": "ささやくのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "communication"
      },
      "icon": "",
      "tags": [
        "communication",
        "level-16",
        "whisper"
      ]
    }
  },
  {
    "id": "word-l16-shout",
    "category": "words",
    "level": 16,
    "before_fields": {
      "title_en": "shout",
      "title_ja": "叫ぶ",
      "content": {
        "word": "shout",
        "japanese": "叫ぶ",
        "kanaReading": "シャウト",
        "pronunciationHint": "Use /ʃ/ and glide through /aʊ/.",
        "exampleSentence": "Do not shout across the room.",
        "exampleJapanese": "部屋の向こうに向かって叫ばないでください。",
        "commonMistake": "Use “shout at” for anger and “shout to” for distance.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "communication"
      },
      "icon": "📣",
      "tags": [
        "communication",
        "level-16",
        "shout"
      ]
    },
    "after_fields": {
      "title_en": "shout",
      "title_ja": "叫ぶ",
      "content": {
        "word": "shout",
        "japanese": "叫ぶ",
        "kanaReading": "シャウト",
        "pronunciationHint": "Use /ʃ/ and glide through /aʊ/.",
        "exampleSentence": "Do not shout across the room.",
        "exampleJapanese": "部屋の向こうに向かって叫ばないでください。",
        "commonMistake": "Use “shout at” for anger and “shout to” for distance.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-9e32a78148e4f67c.svg",
          "kind": "single",
          "altEn": "An illustration of shout.",
          "altJa": "叫ぶのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "communication"
      },
      "icon": "",
      "tags": [
        "communication",
        "level-16",
        "shout"
      ]
    }
  },
  {
    "id": "word-l16-call",
    "category": "words",
    "level": 16,
    "before_fields": {
      "title_en": "call",
      "title_ja": "電話する・呼ぶ",
      "content": {
        "word": "call",
        "japanese": "電話する・呼ぶ",
        "kanaReading": "コール",
        "pronunciationHint": "Hold the vowel and finish with l.",
        "exampleSentence": "I will call you after work.",
        "exampleJapanese": "仕事の後で電話します。",
        "commonMistake": "Do not add “to” before the person: say “call me.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "communication"
      },
      "icon": "📞",
      "tags": [
        "communication",
        "level-16",
        "call"
      ]
    },
    "after_fields": {
      "title_en": "call",
      "title_ja": "電話する・呼ぶ",
      "content": {
        "word": "call",
        "japanese": "電話する・呼ぶ",
        "kanaReading": "コール",
        "pronunciationHint": "Hold the vowel and finish with l.",
        "exampleSentence": "I will call you after work.",
        "exampleJapanese": "仕事の後で電話します。",
        "commonMistake": "Do not add “to” before the person: say “call me.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-6141d0171fb1841c.svg",
          "kind": "single",
          "altEn": "An illustration of call.",
          "altJa": "電話する・呼ぶのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "communication"
      },
      "icon": "",
      "tags": [
        "communication",
        "level-16",
        "call"
      ]
    }
  },
  {
    "id": "word-l16-message",
    "category": "words",
    "level": 16,
    "before_fields": {
      "title_en": "message",
      "title_ja": "メッセージを送る・伝言",
      "content": {
        "word": "message",
        "japanese": "メッセージを送る・伝言",
        "kanaReading": "メッセージ",
        "pronunciationHint": "Stress MES; the final age sounds /ɪdʒ/.",
        "exampleSentence": "Message me when you arrive.",
        "exampleJapanese": "着いたらメッセージを送ってください。",
        "commonMistake": "As a verb, say “message me,” not “message to me.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "communication"
      },
      "icon": "📱",
      "tags": [
        "communication",
        "level-16",
        "message"
      ]
    },
    "after_fields": {
      "title_en": "message",
      "title_ja": "メッセージを送る・伝言",
      "content": {
        "word": "message",
        "japanese": "メッセージを送る・伝言",
        "kanaReading": "メッセージ",
        "pronunciationHint": "Stress MES; the final age sounds /ɪdʒ/.",
        "exampleSentence": "Message me when you arrive.",
        "exampleJapanese": "着いたらメッセージを送ってください。",
        "commonMistake": "As a verb, say “message me,” not “message to me.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-261f54b41a7efad1.svg",
          "kind": "single",
          "altEn": "An illustration of message.",
          "altJa": "メッセージを送る・伝言のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "communication"
      },
      "icon": "",
      "tags": [
        "communication",
        "level-16",
        "message"
      ]
    }
  },
  {
    "id": "word-l16-invite",
    "category": "words",
    "level": 16,
    "before_fields": {
      "title_en": "invite",
      "title_ja": "招待する",
      "content": {
        "word": "invite",
        "japanese": "招待する",
        "kanaReading": "インヴァイト",
        "pronunciationHint": "Stress VITE and use /aɪ/.",
        "exampleSentence": "We invited our neighbors to dinner.",
        "exampleJapanese": "近所の人たちを夕食に招きました。",
        "commonMistake": "Use “invite someone to an event,” not “invite someone for an event.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "communication"
      },
      "icon": "💌",
      "tags": [
        "communication",
        "level-16",
        "invite"
      ]
    },
    "after_fields": {
      "title_en": "invite",
      "title_ja": "招待する",
      "content": {
        "word": "invite",
        "japanese": "招待する",
        "kanaReading": "インヴァイト",
        "pronunciationHint": "Stress VITE and use /aɪ/.",
        "exampleSentence": "We invited our neighbors to dinner.",
        "exampleJapanese": "近所の人たちを夕食に招きました。",
        "commonMistake": "Use “invite someone to a party.” With a meal, both “invite someone to dinner” and “invite someone for dinner” occur.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-46d859ee71d1b97c.svg",
          "kind": "scene",
          "altEn": "A party invitation is sent to a friend, inviting them to join.",
          "altJa": "パーティーに来てほしい友達へ招待状を送っています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "communication"
      },
      "icon": "",
      "tags": [
        "communication",
        "level-16",
        "invite"
      ]
    }
  },
  {
    "id": "word-l17-homework",
    "category": "words",
    "level": 17,
    "before_fields": {
      "title_en": "homework",
      "title_ja": "宿題",
      "content": {
        "word": "homework",
        "japanese": "宿題",
        "kanaReading": "ホームワーク",
        "pronunciationHint": "Stress HOME and connect both parts.",
        "exampleSentence": "I finished my homework before dinner.",
        "exampleJapanese": "夕食前に宿題を終えました。",
        "commonMistake": "“Homework” is uncountable; avoid “homeworks.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "study-skills"
      },
      "icon": "📚",
      "tags": [
        "study-skills",
        "level-17",
        "homework"
      ]
    },
    "after_fields": {
      "title_en": "homework",
      "title_ja": "宿題",
      "content": {
        "word": "homework",
        "japanese": "宿題",
        "kanaReading": "ホームワーク",
        "pronunciationHint": "Stress HOME and connect both parts.",
        "exampleSentence": "I put off my homework until the last minute.",
        "exampleJapanese": "私はぎりぎりまで宿題を後回しにしました。",
        "commonMistake": "“Homework” is uncountable; avoid “homeworks.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f10e2f932bbff8ec.svg",
          "kind": "scene",
          "altEn": "A learner works on a worksheet at home after class.",
          "altJa": "授業後に家でプリントの課題をしている生徒。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "study-skills"
      },
      "icon": "",
      "tags": [
        "study-skills",
        "level-17",
        "homework"
      ]
    }
  },
  {
    "id": "word-l17-question",
    "category": "words",
    "level": 17,
    "before_fields": {
      "title_en": "question",
      "title_ja": "質問・問題",
      "content": {
        "word": "question",
        "japanese": "質問・問題",
        "kanaReading": "クウェスチョン",
        "pronunciationHint": "The tion ending sounds /tʃən/.",
        "exampleSentence": "Write one question about the story.",
        "exampleJapanese": "物語について質問を1つ書いてください。",
        "commonMistake": "Use “ask a question,” not “say a question.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "study-skills"
      },
      "icon": "❔",
      "tags": [
        "study-skills",
        "level-17",
        "question"
      ]
    },
    "after_fields": {
      "title_en": "question",
      "title_ja": "質問・問題",
      "content": {
        "word": "question",
        "japanese": "質問・問題",
        "kanaReading": "クウェスチョン",
        "pronunciationHint": "The tion ending sounds /tʃən/.",
        "exampleSentence": "Ask a follow-up question if the answer is unclear.",
        "exampleJapanese": "答えがはっきりしなければ、追加で質問してください。",
        "commonMistake": "Use “ask a question,” not “say a question.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ab91cd5424964034.svg",
          "kind": "scene",
          "altEn": "A learner points to a question mark on a worksheet.",
          "altJa": "生徒がプリントの疑問点を尋ねています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "study-skills"
      },
      "icon": "",
      "tags": [
        "study-skills",
        "level-17",
        "question"
      ]
    }
  },
  {
    "id": "word-l17-notebook",
    "category": "words",
    "level": 17,
    "before_fields": {
      "title_en": "notebook",
      "title_ja": "ノート",
      "content": {
        "word": "notebook",
        "japanese": "ノート",
        "kanaReading": "ノウトブック",
        "pronunciationHint": "Stress NOTE and keep “book” short.",
        "exampleSentence": "I keep new vocabulary in a notebook.",
        "exampleJapanese": "新しい単語をノートに書いています。",
        "commonMistake": "English “notebook” is a bound writing book, not any memo.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "study-skills"
      },
      "icon": "📓",
      "tags": [
        "study-skills",
        "level-17",
        "notebook"
      ]
    },
    "after_fields": {
      "title_en": "notebook",
      "title_ja": "ノート",
      "content": {
        "word": "notebook",
        "japanese": "ノート",
        "kanaReading": "ノウトブック",
        "pronunciationHint": "Stress NOTE and keep “book” short.",
        "exampleSentence": "I keep track of new words in a notebook.",
        "exampleJapanese": "私は新しい単語をノートに記録しています。",
        "commonMistake": "English “notebook” is a bound writing book, not any memo.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-757488eba8a1dac2.svg",
          "kind": "single",
          "altEn": "An illustration of notebook.",
          "altJa": "ノートのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "study-skills"
      },
      "icon": "",
      "tags": [
        "study-skills",
        "level-17",
        "notebook"
      ]
    }
  },
  {
    "id": "word-l17-dictionary",
    "category": "words",
    "level": 17,
    "before_fields": {
      "title_en": "dictionary",
      "title_ja": "辞書",
      "content": {
        "word": "dictionary",
        "japanese": "辞書",
        "kanaReading": "ディクショナリー",
        "pronunciationHint": "Stress DIC; keep later vowels light.",
        "exampleSentence": "Check the word in a learner’s dictionary.",
        "exampleJapanese": "学習者向け辞書でその単語を調べてください。",
        "commonMistake": "Say “look up a word in a dictionary,” not “search a word.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "study-skills"
      },
      "icon": "📖",
      "tags": [
        "study-skills",
        "level-17",
        "dictionary"
      ]
    },
    "after_fields": {
      "title_en": "dictionary",
      "title_ja": "辞書",
      "content": {
        "word": "dictionary",
        "japanese": "辞書",
        "kanaReading": "ディクショナリー",
        "pronunciationHint": "Stress DIC; keep later vowels light.",
        "exampleSentence": "Look the word up in a dictionary, then make your own sentence.",
        "exampleJapanese": "辞書でその単語を調べてから、自分で文を作ってください。",
        "commonMistake": "Say “look up a word in a dictionary,” not “search a word.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-cfdcd4c10723c0e5.svg",
          "kind": "single",
          "altEn": "An illustration of dictionary.",
          "altJa": "辞書のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "study-skills"
      },
      "icon": "",
      "tags": [
        "study-skills",
        "level-17",
        "dictionary"
      ]
    }
  },
  {
    "id": "word-l17-subject",
    "category": "words",
    "level": 17,
    "before_fields": {
      "title_en": "subject",
      "title_ja": "科目・話題",
      "content": {
        "word": "subject",
        "japanese": "科目・話題",
        "kanaReading": "サブジェクト",
        "pronunciationHint": "As a noun, stress SUB.",
        "exampleSentence": "Science is my favorite subject.",
        "exampleJapanese": "理科は私の好きな科目です。",
        "commonMistake": "Do not confuse a school subject with a lesson period.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "study-skills"
      },
      "icon": "🧪",
      "tags": [
        "study-skills",
        "level-17",
        "subject"
      ]
    },
    "after_fields": {
      "title_en": "subject",
      "title_ja": "科目・話題",
      "content": {
        "word": "subject",
        "japanese": "科目・話題",
        "kanaReading": "サブジェクト",
        "pronunciationHint": "As a noun, stress SUB.",
        "exampleSentence": "Which subject would you like to get better at?",
        "exampleJapanese": "どの科目がもっと得意になりたいですか。",
        "commonMistake": "Do not confuse a school subject with a lesson period.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-e53adec4737bbc79.svg",
          "kind": "contrast",
          "altEn": "Mathematics, science, and English are different school subjects.",
          "altJa": "算数・理科・英語という異なる科目。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "study-skills"
      },
      "icon": "",
      "tags": [
        "study-skills",
        "level-17",
        "subject"
      ]
    }
  },
  {
    "id": "word-l17-grade",
    "category": "words",
    "level": 17,
    "before_fields": {
      "title_en": "grade",
      "title_ja": "成績・学年",
      "content": {
        "word": "grade",
        "japanese": "成績・学年",
        "kanaReading": "グレイド",
        "pronunciationHint": "Blend /gr/ and use /eɪ/.",
        "exampleSentence": "Her writing grade improved this term.",
        "exampleJapanese": "今学期、彼女の作文の成績が上がりました。",
        "commonMistake": "“Grade” can mean a score or school year depending on context.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "study-skills"
      },
      "icon": "📊",
      "tags": [
        "study-skills",
        "level-17",
        "grade"
      ]
    },
    "after_fields": {
      "title_en": "grade",
      "title_ja": "成績・学年",
      "content": {
        "word": "grade",
        "japanese": "成績・学年",
        "kanaReading": "グレイド",
        "pronunciationHint": "Blend /gr/ and use /eɪ/.",
        "exampleSentence": "Her writing grade improved this term.",
        "exampleJapanese": "今学期、彼女の作文の成績が上がりました。",
        "commonMistake": "“Grade” can mean a score or school year depending on context.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ff1cd65f9635b40a.svg",
          "kind": "scene",
          "altEn": "A marked worksheet shows a score of eight out of ten.",
          "altJa": "採点済みのプリントに10点中8点の成績が示されています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "study-skills"
      },
      "icon": "",
      "tags": [
        "study-skills",
        "level-17",
        "grade"
      ]
    }
  },
  {
    "id": "word-l17-test",
    "category": "words",
    "level": 17,
    "before_fields": {
      "title_en": "test",
      "title_ja": "テスト・試験",
      "content": {
        "word": "test",
        "japanese": "テスト・試験",
        "kanaReading": "テスト",
        "pronunciationHint": "Use short /e/ and finish with /st/.",
        "exampleSentence": "We have a listening test tomorrow.",
        "exampleJapanese": "明日はリスニングテストがあります。",
        "commonMistake": "Use “take a test,” not “receive a test,” for sitting an exam.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "study-skills"
      },
      "icon": "🧾",
      "tags": [
        "study-skills",
        "level-17",
        "test"
      ]
    },
    "after_fields": {
      "title_en": "test",
      "title_ja": "テスト・試験",
      "content": {
        "word": "test",
        "japanese": "テスト・試験",
        "kanaReading": "テスト",
        "pronunciationHint": "Use short /e/ and finish with /st/.",
        "exampleSentence": "We have a listening test tomorrow.",
        "exampleJapanese": "明日はリスニングテストがあります。",
        "commonMistake": "Use “take a test,” not “receive a test,” for sitting an exam.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-6940372be398887a.svg",
          "kind": "single",
          "altEn": "An illustration of test.",
          "altJa": "テスト・試験のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "study-skills"
      },
      "icon": "",
      "tags": [
        "study-skills",
        "level-17",
        "test"
      ]
    }
  },
  {
    "id": "word-l17-practice",
    "category": "words",
    "level": 17,
    "before_fields": {
      "title_en": "practice",
      "title_ja": "練習・練習する",
      "content": {
        "word": "practice",
        "japanese": "練習・練習する",
        "kanaReading": "プラクティス",
        "pronunciationHint": "Stress PRAC and use /æ/.",
        "exampleSentence": "Daily practice makes speaking easier.",
        "exampleJapanese": "毎日の練習で話すことが楽になります。",
        "commonMistake": "In UK spelling, the verb is often “practise,” while the noun is “practice.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "study-skills"
      },
      "icon": "🎯",
      "tags": [
        "study-skills",
        "level-17",
        "practice"
      ]
    },
    "after_fields": {
      "title_en": "practice",
      "title_ja": "練習・練習する",
      "content": {
        "word": "practice",
        "japanese": "練習・練習する",
        "kanaReading": "プラクティス",
        "pronunciationHint": "Stress PRAC and use /æ/.",
        "exampleSentence": "Daily practice makes speaking easier.",
        "exampleJapanese": "毎日の練習で話すことが楽になります。",
        "commonMistake": "In UK spelling, the verb is often “practise,” while the noun is “practice.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-63e2d24ad6ede2b0.svg",
          "kind": "sequence",
          "altEn": "A learner tries writing more than once and gets better.",
          "altJa": "繰り返し書く練習をして、できるようになっていく生徒。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "study-skills"
      },
      "icon": "",
      "tags": [
        "study-skills",
        "level-17",
        "practice"
      ]
    }
  },
  {
    "id": "word-l17-remember",
    "category": "words",
    "level": 17,
    "before_fields": {
      "title_en": "remember",
      "title_ja": "覚えている・思い出す",
      "content": {
        "word": "remember",
        "japanese": "覚えている・思い出す",
        "kanaReading": "リメンバー",
        "pronunciationHint": "Stress MEM: re-MEM-ber.",
        "exampleSentence": "Remember to bring your workbook.",
        "exampleJapanese": "ワークブックを持ってくるのを忘れないでください。",
        "commonMistake": "“Remember to do” is future duty; “remember doing” recalls the past.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "study-skills"
      },
      "icon": "🧠",
      "tags": [
        "study-skills",
        "level-17",
        "remember"
      ]
    },
    "after_fields": {
      "title_en": "remember",
      "title_ja": "覚えている・思い出す",
      "content": {
        "word": "remember",
        "japanese": "覚えている・思い出す",
        "kanaReading": "リメンバー",
        "pronunciationHint": "Stress MEM: re-MEM-ber.",
        "exampleSentence": "Remember to bring your workbook.",
        "exampleJapanese": "ワークブックを持ってくるのを忘れないでください。",
        "commonMistake": "“Remember to do” is future duty; “remember doing” recalls the past.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-762858887b920f5a.svg",
          "kind": "scene",
          "altEn": "A person recalls their key in a thought bubble.",
          "altJa": "人が頭の中で鍵を思い出しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "study-skills"
      },
      "icon": "",
      "tags": [
        "study-skills",
        "level-17",
        "remember"
      ]
    }
  },
  {
    "id": "word-l17-improve",
    "category": "words",
    "level": 17,
    "before_fields": {
      "title_en": "improve",
      "title_ja": "改善する・上達する",
      "content": {
        "word": "improve",
        "japanese": "改善する・上達する",
        "kanaReading": "インプルーヴ",
        "pronunciationHint": "Stress PROVE and finish with voiced v.",
        "exampleSentence": "Reading aloud can improve your rhythm.",
        "exampleJapanese": "音読すると話すリズムがよくなります。",
        "commonMistake": "Use “improve something” without “to.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "study-skills"
      },
      "icon": "📈",
      "tags": [
        "study-skills",
        "level-17",
        "improve"
      ]
    },
    "after_fields": {
      "title_en": "improve",
      "title_ja": "改善する・上達する",
      "content": {
        "word": "improve",
        "japanese": "改善する・上達する",
        "kanaReading": "インプルーヴ",
        "pronunciationHint": "Stress PROVE and finish with voiced v.",
        "exampleSentence": "Reading aloud can improve your rhythm.",
        "exampleJapanese": "音読すると話すリズムがよくなります。",
        "commonMistake": "Use “improve something” without “to.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4103647195ce2a4a.svg",
          "kind": "sequence",
          "altEn": "Regular reading accompanies a steadily rising progress chart.",
          "altJa": "読書を続け、上達のグラフが少しずつ上がっています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "study-skills"
      },
      "icon": "",
      "tags": [
        "study-skills",
        "level-17",
        "improve"
      ]
    }
  },
  {
    "id": "word-l18-office",
    "category": "words",
    "level": 18,
    "before_fields": {
      "title_en": "office",
      "title_ja": "オフィス・事務所",
      "content": {
        "word": "office",
        "japanese": "オフィス・事務所",
        "kanaReading": "オフィス",
        "pronunciationHint": "Stress OF; the ending is /ɪs/.",
        "exampleSentence": "Our office is near the station.",
        "exampleJapanese": "私たちのオフィスは駅の近くです。",
        "commonMistake": "Say “at the office” for your workplace location.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "work"
      },
      "icon": "🏢",
      "tags": [
        "work",
        "level-18",
        "office"
      ]
    },
    "after_fields": {
      "title_en": "office",
      "title_ja": "オフィス・事務所",
      "content": {
        "word": "office",
        "japanese": "オフィス・事務所",
        "kanaReading": "オフィス",
        "pronunciationHint": "Stress OF; the ending is /ɪs/.",
        "exampleSentence": "I work from home twice a week and spend the other days at the office.",
        "exampleJapanese": "週に2日は在宅で働き、ほかの日はオフィスで働きます。",
        "commonMistake": "Say “at the office” for your workplace location.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-afe1b93e3c83c243.svg",
          "kind": "single",
          "altEn": "An illustration of office.",
          "altJa": "オフィス・事務所のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "work"
      },
      "icon": "",
      "tags": [
        "work",
        "level-18",
        "office"
      ]
    }
  },
  {
    "id": "word-l18-meeting",
    "category": "words",
    "level": 18,
    "before_fields": {
      "title_en": "meeting",
      "title_ja": "会議",
      "content": {
        "word": "meeting",
        "japanese": "会議",
        "kanaReading": "ミーティング",
        "pronunciationHint": "Stress MEET and hold /iː/.",
        "exampleSentence": "The meeting starts in five minutes.",
        "exampleJapanese": "会議は5分後に始まります。",
        "commonMistake": "Use “have a meeting,” not “do a meeting.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "work"
      },
      "icon": "👥",
      "tags": [
        "work",
        "level-18",
        "meeting"
      ]
    },
    "after_fields": {
      "title_en": "meeting",
      "title_ja": "会議",
      "content": {
        "word": "meeting",
        "japanese": "会議",
        "kanaReading": "ミーティング",
        "pronunciationHint": "Stress MEET and hold /iː/.",
        "exampleSentence": "The meeting starts in five minutes.",
        "exampleJapanese": "会議は5分後に始まります。",
        "commonMistake": "Use “have a meeting,” not “do a meeting.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-38d1bfa697b9efb5.svg",
          "kind": "scene",
          "altEn": "People gather around shared work at an agreed time.",
          "altJa": "予定した時刻に集まり、相談している人たち。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "work"
      },
      "icon": "",
      "tags": [
        "work",
        "level-18",
        "meeting"
      ]
    }
  },
  {
    "id": "word-l18-schedule",
    "category": "words",
    "level": 18,
    "before_fields": {
      "title_en": "schedule",
      "title_ja": "予定・日程",
      "content": {
        "word": "schedule",
        "japanese": "予定・日程",
        "kanaReading": "スケジュール",
        "pronunciationHint": "US often begins /sk/; UK often begins /ʃ/.",
        "exampleSentence": "My schedule is full on Thursday.",
        "exampleJapanese": "木曜日は予定がいっぱいです。",
        "commonMistake": "Both common pronunciations are acceptable; stay consistent.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "work"
      },
      "icon": "🗓️",
      "tags": [
        "work",
        "level-18",
        "schedule"
      ]
    },
    "after_fields": {
      "title_en": "schedule",
      "title_ja": "予定・日程",
      "content": {
        "word": "schedule",
        "japanese": "予定・日程",
        "kanaReading": "スケジュール",
        "pronunciationHint": "US often begins /sk/; UK often begins /ʃ/.",
        "exampleSentence": "My schedule is full on Thursday.",
        "exampleJapanese": "木曜日は予定がいっぱいです。",
        "commonMistake": "Both common pronunciations are acceptable; stay consistent.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d2913a50ed9957d1.svg",
          "kind": "scene",
          "altEn": "A weekly calendar contains several appointments with times.",
          "altJa": "週間カレンダーに時刻付きの予定が並んでいます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "work"
      },
      "icon": "",
      "tags": [
        "work",
        "level-18",
        "schedule"
      ]
    }
  },
  {
    "id": "word-l18-customer",
    "category": "words",
    "level": 18,
    "before_fields": {
      "title_en": "customer",
      "title_ja": "顧客・お客さま",
      "content": {
        "word": "customer",
        "japanese": "顧客・お客さま",
        "kanaReading": "カスタマー",
        "pronunciationHint": "Stress CUS; later vowels are weak.",
        "exampleSentence": "The customer asked for a receipt.",
        "exampleJapanese": "お客さまは領収書を求めました。",
        "commonMistake": "A “customer” buys; a “client” often receives professional services.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "work"
      },
      "icon": "🛍️",
      "tags": [
        "work",
        "level-18",
        "customer"
      ]
    },
    "after_fields": {
      "title_en": "customer",
      "title_ja": "顧客・お客さま",
      "content": {
        "word": "customer",
        "japanese": "顧客・お客さま",
        "kanaReading": "カスタマー",
        "pronunciationHint": "Stress CUS; later vowels are weak.",
        "exampleSentence": "The customer asked for a receipt.",
        "exampleJapanese": "お客さまは領収書を求めました。",
        "commonMistake": "A “customer” buys; a “client” often receives professional services.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-569a84ff5c4e0a78.svg",
          "kind": "scene",
          "altEn": "A person pays for something in a shop.",
          "altJa": "店で商品にお金を払っているお客さん。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "work"
      },
      "icon": "",
      "tags": [
        "work",
        "level-18",
        "customer"
      ]
    }
  },
  {
    "id": "word-l18-manager",
    "category": "words",
    "level": 18,
    "before_fields": {
      "title_en": "manager",
      "title_ja": "管理者・店長",
      "content": {
        "word": "manager",
        "japanese": "管理者・店長",
        "kanaReading": "マネジャー",
        "pronunciationHint": "Stress MAN and make g sound /dʒ/.",
        "exampleSentence": "The manager approved my day off.",
        "exampleJapanese": "上司は私の休暇を承認しました。",
        "commonMistake": "Do not pronounce the g as in “go.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "work"
      },
      "icon": "🧑‍💼",
      "tags": [
        "work",
        "level-18",
        "manager"
      ]
    },
    "after_fields": {
      "title_en": "manager",
      "title_ja": "管理者・店長",
      "content": {
        "word": "manager",
        "japanese": "管理者・店長",
        "kanaReading": "マネジャー",
        "pronunciationHint": "Stress MAN and make g sound /dʒ/.",
        "exampleSentence": "The manager approved my day off.",
        "exampleJapanese": "上司は私の休暇を承認しました。",
        "commonMistake": "Do not pronounce the g as in “go.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-a8e49b74dbbedc3c.svg",
          "kind": "scene",
          "altEn": "One person coordinates the work of a small team.",
          "altJa": "一人がチームの仕事をまとめ、担当を伝えています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "work"
      },
      "icon": "",
      "tags": [
        "work",
        "level-18",
        "manager"
      ]
    }
  },
  {
    "id": "word-l18-project",
    "category": "words",
    "level": 18,
    "before_fields": {
      "title_en": "project",
      "title_ja": "プロジェクト",
      "content": {
        "word": "project",
        "japanese": "プロジェクト",
        "kanaReading": "プロジェクト",
        "pronunciationHint": "As a noun, stress PROJ.",
        "exampleSentence": "Our project needs a clearer goal.",
        "exampleJapanese": "私たちのプロジェクトにはもっと明確な目標が必要です。",
        "commonMistake": "The verb “project” has stress on the second syllable.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "work"
      },
      "icon": "🗂️",
      "tags": [
        "work",
        "level-18",
        "project"
      ]
    },
    "after_fields": {
      "title_en": "project",
      "title_ja": "プロジェクト",
      "content": {
        "word": "project",
        "japanese": "プロジェクト",
        "kanaReading": "プロジェクト",
        "pronunciationHint": "As a noun, stress PROJ.",
        "exampleSentence": "Our project needs a clearer goal.",
        "exampleJapanese": "私たちのプロジェクトにはもっと明確な目標が必要です。",
        "commonMistake": "The verb “project” has stress on the second syllable.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-cd7eca6aeed87074.svg",
          "kind": "sequence",
          "altEn": "A team turns separate tasks into a finished result over several days.",
          "altJa": "何日かかけて作業を組み合わせ、一つの成果を完成させます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "work"
      },
      "icon": "",
      "tags": [
        "work",
        "level-18",
        "project"
      ]
    }
  },
  {
    "id": "word-l18-report",
    "category": "words",
    "level": 18,
    "before_fields": {
      "title_en": "report",
      "title_ja": "報告書・報告する",
      "content": {
        "word": "report",
        "japanese": "報告書・報告する",
        "kanaReading": "リポート",
        "pronunciationHint": "Stress PORT.",
        "exampleSentence": "Please send the report by noon.",
        "exampleJapanese": "正午までに報告書を送ってください。",
        "commonMistake": "Say “report on a topic,” not “report about” in formal contexts.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "work"
      },
      "icon": "📄",
      "tags": [
        "work",
        "level-18",
        "report"
      ]
    },
    "after_fields": {
      "title_en": "report",
      "title_ja": "報告書・報告する",
      "content": {
        "word": "report",
        "japanese": "報告書・報告する",
        "kanaReading": "リポート",
        "pronunciationHint": "Stress PORT.",
        "exampleSentence": "Please send the report by noon.",
        "exampleJapanese": "正午までに報告書を送ってください。",
        "commonMistake": "Use “write a report on the results.” As a verb, “report to the manager” identifies the person you report to.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-a92112e53ef08357.svg",
          "kind": "scene",
          "altEn": "A document combines written findings with a chart.",
          "altJa": "文章とグラフで調べた結果をまとめた報告書。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "work"
      },
      "icon": "",
      "tags": [
        "work",
        "level-18",
        "report"
      ]
    }
  },
  {
    "id": "word-l18-deadline",
    "category": "words",
    "level": 18,
    "before_fields": {
      "title_en": "deadline",
      "title_ja": "締め切り",
      "content": {
        "word": "deadline",
        "japanese": "締め切り",
        "kanaReading": "デッドライン",
        "pronunciationHint": "Stress DEAD and connect both parts.",
        "exampleSentence": "The deadline is next Wednesday.",
        "exampleJapanese": "締め切りは次の水曜日です。",
        "commonMistake": "Say “meet a deadline,” not “keep a deadline.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "work"
      },
      "icon": "⏳",
      "tags": [
        "work",
        "level-18",
        "deadline"
      ]
    },
    "after_fields": {
      "title_en": "deadline",
      "title_ja": "締め切り",
      "content": {
        "word": "deadline",
        "japanese": "締め切り",
        "kanaReading": "デッドライン",
        "pronunciationHint": "Stress DEAD and connect both parts.",
        "exampleSentence": "The deadline is next Wednesday.",
        "exampleJapanese": "締め切りは次の水曜日です。",
        "commonMistake": "Say “meet a deadline,” not “keep a deadline.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b9add2fc02f0a25e.svg",
          "kind": "scene",
          "altEn": "A task must be handed in by Friday at three.",
          "altJa": "金曜日の3時までに提出する必要がある課題。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "work"
      },
      "icon": "",
      "tags": [
        "work",
        "level-18",
        "deadline"
      ]
    }
  },
  {
    "id": "word-l18-colleague",
    "category": "words",
    "level": 18,
    "before_fields": {
      "title_en": "colleague",
      "title_ja": "同僚",
      "content": {
        "word": "colleague",
        "japanese": "同僚",
        "kanaReading": "コリーグ",
        "pronunciationHint": "Stress COL and hold /iː/ at the end.",
        "exampleSentence": "A colleague helped me check the figures.",
        "exampleJapanese": "同僚が数字の確認を手伝ってくれました。",
        "commonMistake": "Do not use “colleague” for every friend at work unless you work together.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "work"
      },
      "icon": "🤝",
      "tags": [
        "work",
        "level-18",
        "colleague"
      ]
    },
    "after_fields": {
      "title_en": "colleague",
      "title_ja": "同僚",
      "content": {
        "word": "colleague",
        "japanese": "同僚",
        "kanaReading": "コリーグ",
        "pronunciationHint": "Stress COL, then use /iː/ and finish with /ɡ/.",
        "exampleSentence": "A colleague helped me check the figures.",
        "exampleJapanese": "同僚が数字の確認を手伝ってくれました。",
        "commonMistake": "A colleague is someone you work with; “classmate” is someone in your class.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c0baccdd9eda7039.svg",
          "kind": "scene",
          "altEn": "Two people doing work alongside each other.",
          "altJa": "一緒の職場で働く二人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "work"
      },
      "icon": "",
      "tags": [
        "work",
        "level-18",
        "colleague"
      ]
    }
  },
  {
    "id": "word-l18-break",
    "category": "words",
    "level": 18,
    "before_fields": {
      "title_en": "break",
      "title_ja": "休憩・壊す",
      "content": {
        "word": "break",
        "japanese": "休憩・壊す",
        "kanaReading": "ブレイク",
        "pronunciationHint": "Use the /eɪ/ vowel.",
        "exampleSentence": "Let us take a short break.",
        "exampleJapanese": "短い休憩を取りましょう。",
        "commonMistake": "Use “take a break,” not “do a break.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "work"
      },
      "icon": "☕",
      "tags": [
        "work",
        "level-18",
        "break"
      ]
    },
    "after_fields": {
      "title_en": "break",
      "title_ja": "休憩・壊す",
      "content": {
        "word": "break",
        "japanese": "休憩・壊す",
        "kanaReading": "ブレイク",
        "pronunciationHint": "Use the /eɪ/ vowel.",
        "exampleSentence": "Let us take a short break.",
        "exampleJapanese": "短い休憩を取りましょう。",
        "commonMistake": "Use “take a break,” not “do a break.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-51e008631e764352.svg",
          "kind": "single",
          "altEn": "An illustration of break.",
          "altJa": "休憩・壊すのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "work"
      },
      "icon": "",
      "tags": [
        "work",
        "level-18",
        "break"
      ]
    }
  },
  {
    "id": "word-l19-doctor",
    "category": "words",
    "level": 19,
    "before_fields": {
      "title_en": "doctor",
      "title_ja": "医師",
      "content": {
        "word": "doctor",
        "japanese": "医師",
        "kanaReading": "ドクター",
        "pronunciationHint": "Stress DOC; the ending is weak.",
        "exampleSentence": "The doctor asked about my symptoms.",
        "exampleJapanese": "医師は私の症状について尋ねました。",
        "commonMistake": "Use “see a doctor,” not “meet a doctor,” for medical care.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "health"
      },
      "icon": "🧑‍⚕️",
      "tags": [
        "health",
        "level-19",
        "doctor"
      ]
    },
    "after_fields": {
      "title_en": "doctor",
      "title_ja": "医師",
      "content": {
        "word": "doctor",
        "japanese": "医師",
        "kanaReading": "ドクター",
        "pronunciationHint": "Stress DOC; the ending is weak.",
        "exampleSentence": "The doctor asked about my symptoms.",
        "exampleJapanese": "医師は私の症状について尋ねました。",
        "commonMistake": "Use “see a doctor,” not “meet a doctor,” for medical care.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-9776f82bb27c373b.svg",
          "kind": "single",
          "altEn": "An illustration of doctor.",
          "altJa": "医師のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "health"
      },
      "icon": "",
      "tags": [
        "health",
        "level-19",
        "doctor"
      ]
    }
  },
  {
    "id": "word-l19-medicine",
    "category": "words",
    "level": 19,
    "before_fields": {
      "title_en": "medicine",
      "title_ja": "薬",
      "content": {
        "word": "medicine",
        "japanese": "薬",
        "kanaReading": "メディスン",
        "pronunciationHint": "Usually three syllables: MED-i-cine.",
        "exampleSentence": "Take this medicine after breakfast.",
        "exampleJapanese": "この薬を朝食後に飲んでください。",
        "commonMistake": "Say “take medicine,” not “drink medicine” generally.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "health"
      },
      "icon": "💊",
      "tags": [
        "health",
        "level-19",
        "medicine"
      ]
    },
    "after_fields": {
      "title_en": "medicine",
      "title_ja": "薬",
      "content": {
        "word": "medicine",
        "japanese": "薬",
        "kanaReading": "メディスン",
        "pronunciationHint": "Stress MED. Speakers may use two syllables or a light middle syllable; do not stress the ending.",
        "exampleSentence": "Take this medicine after breakfast.",
        "exampleJapanese": "この薬を朝食後に飲んでください。",
        "commonMistake": "Say “take medicine,” not “drink medicine” generally.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-da8cc82a350c187d.svg",
          "kind": "single",
          "altEn": "An illustration of medicine.",
          "altJa": "薬のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "health"
      },
      "icon": "",
      "tags": [
        "health",
        "level-19",
        "medicine"
      ]
    }
  },
  {
    "id": "word-l19-fever",
    "category": "words",
    "level": 19,
    "before_fields": {
      "title_en": "fever",
      "title_ja": "熱・発熱",
      "content": {
        "word": "fever",
        "japanese": "熱・発熱",
        "kanaReading": "フィーヴァー",
        "pronunciationHint": "Stress FEE and use /v/.",
        "exampleSentence": "He has a slight fever.",
        "exampleJapanese": "彼には微熱があります。",
        "commonMistake": "Say “have a fever,” not “be fever.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "health"
      },
      "icon": "🌡️",
      "tags": [
        "health",
        "level-19",
        "fever"
      ]
    },
    "after_fields": {
      "title_en": "fever",
      "title_ja": "熱・発熱",
      "content": {
        "word": "fever",
        "japanese": "熱・発熱",
        "kanaReading": "フィーヴァー",
        "pronunciationHint": "Stress FEE and use /v/.",
        "exampleSentence": "He has a slight fever.",
        "exampleJapanese": "彼には微熱があります。",
        "commonMistake": "Say “have a fever,” not “be fever.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-3f7ef84b4b3a126e.svg",
          "kind": "scene",
          "altEn": "A person feels hot and a thermometer shows a raised temperature.",
          "altJa": "体が熱く、体温計に高い体温が表示されています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "health"
      },
      "icon": "",
      "tags": [
        "health",
        "level-19",
        "fever"
      ]
    }
  },
  {
    "id": "word-l19-cough",
    "category": "words",
    "level": 19,
    "before_fields": {
      "title_en": "cough",
      "title_ja": "せき・せきをする",
      "content": {
        "word": "cough",
        "japanese": "せき・せきをする",
        "kanaReading": "コフ",
        "pronunciationHint": "The gh sounds /f/.",
        "exampleSentence": "Her cough is getting better.",
        "exampleJapanese": "彼女のせきはよくなっています。",
        "commonMistake": "As a verb, say “cough,” not “do a cough.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "health"
      },
      "icon": "😷",
      "tags": [
        "health",
        "level-19",
        "cough"
      ]
    },
    "after_fields": {
      "title_en": "cough",
      "title_ja": "せき・せきをする",
      "content": {
        "word": "cough",
        "japanese": "せき・せきをする",
        "kanaReading": "コフ",
        "pronunciationHint": "The gh sounds /f/.",
        "exampleSentence": "Her cough is getting better.",
        "exampleJapanese": "彼女のせきはよくなっています。",
        "commonMistake": "As a verb, say “cough,” not “do a cough.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-8b78fd0207f89667.svg",
          "kind": "scene",
          "altEn": "A person covers their mouth while coughing.",
          "altJa": "口を覆いながらせきをしている人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "health"
      },
      "icon": "",
      "tags": [
        "health",
        "level-19",
        "cough"
      ]
    }
  },
  {
    "id": "word-l19-headache",
    "category": "words",
    "level": 19,
    "before_fields": {
      "title_en": "headache",
      "title_ja": "頭痛",
      "content": {
        "word": "headache",
        "japanese": "頭痛",
        "kanaReading": "ヘッドエイク",
        "pronunciationHint": "Stress HEAD and pronounce “ache” /eɪk/.",
        "exampleSentence": "I have a headache from the bright screen.",
        "exampleJapanese": "明るい画面のせいで頭が痛いです。",
        "commonMistake": "Say “have a headache,” not “my head is headache.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "health"
      },
      "icon": "🤕",
      "tags": [
        "health",
        "level-19",
        "headache"
      ]
    },
    "after_fields": {
      "title_en": "headache",
      "title_ja": "頭痛",
      "content": {
        "word": "headache",
        "japanese": "頭痛",
        "kanaReading": "ヘッドエイク",
        "pronunciationHint": "Stress HEAD and pronounce “ache” /eɪk/.",
        "exampleSentence": "I have a headache from the bright screen.",
        "exampleJapanese": "明るい画面のせいで頭が痛いです。",
        "commonMistake": "Say “have a headache,” not “my head is headache.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ff406ff7dc251386.svg",
          "kind": "single",
          "altEn": "An illustration of headache.",
          "altJa": "頭痛のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "health"
      },
      "icon": "",
      "tags": [
        "health",
        "level-19",
        "headache"
      ]
    }
  },
  {
    "id": "word-l19-rest",
    "category": "words",
    "level": 19,
    "before_fields": {
      "title_en": "rest",
      "title_ja": "休む・休息",
      "content": {
        "word": "rest",
        "japanese": "休む・休息",
        "kanaReading": "レスト",
        "pronunciationHint": "Use short /e/ and finish with /st/.",
        "exampleSentence": "You should rest this afternoon.",
        "exampleJapanese": "今日の午後は休んだほうがいいです。",
        "commonMistake": "“Get some rest” is very common; “take a rest” is also natural in some varieties and contexts.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "health"
      },
      "icon": "🛌",
      "tags": [
        "health",
        "level-19",
        "rest"
      ]
    },
    "after_fields": {
      "title_en": "rest",
      "title_ja": "休む・休息",
      "content": {
        "word": "rest",
        "japanese": "休む・休息",
        "kanaReading": "レスト",
        "pronunciationHint": "Use short /e/ and finish with /st/.",
        "exampleSentence": "You should rest this afternoon.",
        "exampleJapanese": "今日の午後は休んだほうがいいです。",
        "commonMistake": "“Get some rest” is very common; “take a rest” is also natural in some varieties and contexts.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5ca17de15d7563de.svg",
          "kind": "single",
          "altEn": "An illustration of rest.",
          "altJa": "休む・休息のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "health"
      },
      "icon": "",
      "tags": [
        "health",
        "level-19",
        "rest"
      ]
    }
  },
  {
    "id": "word-l19-healthy",
    "category": "words",
    "level": 19,
    "before_fields": {
      "title_en": "healthy",
      "title_ja": "健康な",
      "content": {
        "word": "healthy",
        "japanese": "健康な",
        "kanaReading": "ヘルシー",
        "pronunciationHint": "The th is unvoiced /θ/.",
        "exampleSentence": "A healthy breakfast gives me energy.",
        "exampleJapanese": "健康的な朝食で元気が出ます。",
        "commonMistake": "Use “healthy” for a person or habit; “healthful” is less common.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "health"
      },
      "icon": "🥗",
      "tags": [
        "health",
        "level-19",
        "healthy"
      ]
    },
    "after_fields": {
      "title_en": "healthy",
      "title_ja": "健康な",
      "content": {
        "word": "healthy",
        "japanese": "健康な",
        "kanaReading": "ヘルシー",
        "pronunciationHint": "The th is unvoiced /θ/.",
        "exampleSentence": "A healthy breakfast gives me energy.",
        "exampleJapanese": "健康的な朝食で元気が出ます。",
        "commonMistake": "Use “healthy” for a person or habit; “healthful” is less common.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5ec1c2f404f0df39.svg",
          "kind": "single",
          "altEn": "An illustration of healthy.",
          "altJa": "健康なのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "health"
      },
      "icon": "",
      "tags": [
        "health",
        "level-19",
        "healthy"
      ]
    }
  },
  {
    "id": "word-l19-exercise",
    "category": "words",
    "level": 19,
    "before_fields": {
      "title_en": "exercise",
      "title_ja": "運動・練習する",
      "content": {
        "word": "exercise",
        "japanese": "運動・練習する",
        "kanaReading": "エクササイズ",
        "pronunciationHint": "Stress EX; the final s sounds /z/.",
        "exampleSentence": "Gentle exercise helps my back.",
        "exampleJapanese": "軽い運動は腰に良いです。",
        "commonMistake": "“Exercise” can be countable for a task, uncountable for activity.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "health"
      },
      "icon": "🏋️",
      "tags": [
        "health",
        "level-19",
        "exercise"
      ]
    },
    "after_fields": {
      "title_en": "exercise",
      "title_ja": "運動・練習する",
      "content": {
        "word": "exercise",
        "japanese": "運動・練習する",
        "kanaReading": "エクササイズ",
        "pronunciationHint": "Stress EX; the final s sounds /z/.",
        "exampleSentence": "Gentle exercise helps my back.",
        "exampleJapanese": "軽い運動は腰に良いです。",
        "commonMistake": "“Exercise” can be countable for a task, uncountable for activity.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-730ec7fe27b16fc4.svg",
          "kind": "single",
          "altEn": "An illustration of exercise.",
          "altJa": "運動・練習するのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "health"
      },
      "icon": "",
      "tags": [
        "health",
        "level-19",
        "exercise"
      ]
    }
  },
  {
    "id": "word-l19-pain",
    "category": "words",
    "level": 19,
    "before_fields": {
      "title_en": "pain",
      "title_ja": "痛み",
      "content": {
        "word": "pain",
        "japanese": "痛み",
        "kanaReading": "ペイン",
        "pronunciationHint": "Use the /eɪ/ vowel.",
        "exampleSentence": "I felt a sharp pain in my shoulder.",
        "exampleJapanese": "肩に鋭い痛みを感じました。",
        "commonMistake": "Use “pain in my shoulder,” not “pain of my shoulder.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "health"
      },
      "icon": "⚡",
      "tags": [
        "health",
        "level-19",
        "pain"
      ]
    },
    "after_fields": {
      "title_en": "pain",
      "title_ja": "痛み",
      "content": {
        "word": "pain",
        "japanese": "痛み",
        "kanaReading": "ペイン",
        "pronunciationHint": "Use the /eɪ/ vowel.",
        "exampleSentence": "I felt a sharp pain in my shoulder.",
        "exampleJapanese": "肩に鋭い痛みを感じました。",
        "commonMistake": "Use “pain in my shoulder,” not “pain of my shoulder.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f6ddc48d75a2990d.svg",
          "kind": "single",
          "altEn": "A red pulse highlights a sore part of an arm.",
          "altJa": "腕の痛い部分が赤いしるしで示されています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "health"
      },
      "icon": "",
      "tags": [
        "health",
        "level-19",
        "pain"
      ]
    }
  },
  {
    "id": "word-l19-appointment",
    "category": "words",
    "level": 19,
    "before_fields": {
      "title_en": "appointment",
      "title_ja": "予約・約束",
      "content": {
        "word": "appointment",
        "japanese": "予約・約束",
        "kanaReading": "アポイントメント",
        "pronunciationHint": "Stress POINT.",
        "exampleSentence": "I made a dentist appointment for Monday.",
        "exampleJapanese": "月曜日に歯医者の予約を取りました。",
        "commonMistake": "Say “make an appointment,” not “reserve a doctor.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "health"
      },
      "icon": "📆",
      "tags": [
        "health",
        "level-19",
        "appointment"
      ]
    },
    "after_fields": {
      "title_en": "appointment",
      "title_ja": "予約・約束",
      "content": {
        "word": "appointment",
        "japanese": "予約・約束",
        "kanaReading": "アポイントメント",
        "pronunciationHint": "Stress POINT.",
        "exampleSentence": "I made a dentist appointment for Monday.",
        "exampleJapanese": "月曜日に歯医者の予約を取りました。",
        "commonMistake": "Say “make an appointment,” not “reserve a doctor.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-eb5d6ef8ff2bd7f5.svg",
          "kind": "scene",
          "altEn": "A calendar marks an agreed time to see a doctor.",
          "altJa": "カレンダーに医師と会う予約時刻が入っています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "health"
      },
      "icon": "",
      "tags": [
        "health",
        "level-19",
        "appointment"
      ]
    }
  },
  {
    "id": "word-l20-price",
    "category": "words",
    "level": 20,
    "before_fields": {
      "title_en": "price",
      "title_ja": "価格",
      "content": {
        "word": "price",
        "japanese": "価格",
        "kanaReading": "プライス",
        "pronunciationHint": "Use /aɪ/ and finish with /s/.",
        "exampleSentence": "The price includes tax.",
        "exampleJapanese": "価格には税金が含まれています。",
        "commonMistake": "“Price” is the amount asked; “cost” can be the amount paid.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "shopping-and-money"
      },
      "icon": "🏷️",
      "tags": [
        "shopping-and-money",
        "level-20",
        "price"
      ]
    },
    "after_fields": {
      "title_en": "price",
      "title_ja": "価格",
      "content": {
        "word": "price",
        "japanese": "価格",
        "kanaReading": "プライス",
        "pronunciationHint": "Use /aɪ/ and finish with /s/.",
        "exampleSentence": "The price includes tax.",
        "exampleJapanese": "価格には税金が含まれています。",
        "commonMistake": "“Price” is the amount asked; “cost” can be the amount paid.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-18204f958e9d3835.svg",
          "kind": "single",
          "altEn": "A price tag on a coat shows the amount the shop asks for.",
          "altJa": "コートの値札に店が提示した値段が書かれています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "shopping-and-money"
      },
      "icon": "",
      "tags": [
        "shopping-and-money",
        "level-20",
        "price"
      ]
    }
  },
  {
    "id": "word-l20-cost",
    "category": "words",
    "level": 20,
    "before_fields": {
      "title_en": "cost",
      "title_ja": "費用・費用がかかる",
      "content": {
        "word": "cost",
        "japanese": "費用・費用がかかる",
        "kanaReading": "コスト",
        "pronunciationHint": "Use a short vowel and final /st/.",
        "exampleSentence": "How much does delivery cost?",
        "exampleJapanese": "配送料はいくらかかりますか。",
        "commonMistake": "Ask “How much does it cost?” not “How much is the cost?” in casual speech.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "shopping-and-money"
      },
      "icon": "💰",
      "tags": [
        "shopping-and-money",
        "level-20",
        "cost"
      ]
    },
    "after_fields": {
      "title_en": "cost",
      "title_ja": "費用・費用がかかる",
      "content": {
        "word": "cost",
        "japanese": "費用・費用がかかる",
        "kanaReading": "コスト",
        "pronunciationHint": "Use a short vowel and final /st/.",
        "exampleSentence": "How much does delivery cost?",
        "exampleJapanese": "配送料はいくらかかりますか。",
        "commonMistake": "Ask “How much does it cost?” not “How much is the cost?” in casual speech.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-59a39a8d8c2aff64.svg",
          "kind": "scene",
          "altEn": "The cost combines the item price and a delivery charge.",
          "altJa": "商品の代金と配送料を合わせた費用。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "shopping-and-money"
      },
      "icon": "",
      "tags": [
        "shopping-and-money",
        "level-20",
        "cost"
      ]
    }
  },
  {
    "id": "word-l20-cash",
    "category": "words",
    "level": 20,
    "before_fields": {
      "title_en": "cash",
      "title_ja": "現金",
      "content": {
        "word": "cash",
        "japanese": "現金",
        "kanaReading": "キャッシュ",
        "pronunciationHint": "Use /æ/ and finish with /ʃ/.",
        "exampleSentence": "Can I pay in cash?",
        "exampleJapanese": "現金で払えますか。",
        "commonMistake": "Say “pay in cash” or “pay cash,” not “pay by cash.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "shopping-and-money"
      },
      "icon": "💵",
      "tags": [
        "shopping-and-money",
        "level-20",
        "cash"
      ]
    },
    "after_fields": {
      "title_en": "cash",
      "title_ja": "現金",
      "content": {
        "word": "cash",
        "japanese": "現金",
        "kanaReading": "キャッシュ",
        "pronunciationHint": "Use /æ/ and finish with /ʃ/.",
        "exampleSentence": "Can I pay in cash?",
        "exampleJapanese": "現金で払えますか。",
        "commonMistake": "Say “pay in cash” or “pay cash,” not “pay by cash.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-feb00787d0412746.svg",
          "kind": "single",
          "altEn": "An illustration of cash.",
          "altJa": "現金のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "shopping-and-money"
      },
      "icon": "",
      "tags": [
        "shopping-and-money",
        "level-20",
        "cash"
      ]
    }
  },
  {
    "id": "word-l20-change",
    "category": "words",
    "level": 20,
    "before_fields": {
      "title_en": "change",
      "title_ja": "おつり・変化",
      "content": {
        "word": "change",
        "japanese": "おつり・変化",
        "kanaReading": "チェインジ",
        "pronunciationHint": "Begin /tʃ/ and finish /ndʒ/.",
        "exampleSentence": "Here is your change.",
        "exampleJapanese": "こちらがおつりです。",
        "commonMistake": "“Change” is uncountable when it means coins or money returned.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "shopping-and-money"
      },
      "icon": "🪙",
      "tags": [
        "shopping-and-money",
        "level-20",
        "change"
      ]
    },
    "after_fields": {
      "title_en": "change",
      "title_ja": "おつり・変化",
      "content": {
        "word": "change",
        "japanese": "おつり・変化",
        "kanaReading": "チェインジ",
        "pronunciationHint": "Begin /tʃ/ and finish /ndʒ/.",
        "exampleSentence": "Here is your change.",
        "exampleJapanese": "こちらがおつりです。",
        "commonMistake": "“Change” is uncountable when it means coins or money returned.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-807ec2e7998517dd.svg",
          "kind": "sequence",
          "altEn": "A buyer pays ¥1,000 for a ¥700 item and receives ¥300 back.",
          "altJa": "700円の商品に1,000円を払い、300円のおつりを受け取ります。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "shopping-and-money"
      },
      "icon": "",
      "tags": [
        "shopping-and-money",
        "level-20",
        "change"
      ]
    }
  },
  {
    "id": "word-l20-receipt",
    "category": "words",
    "level": 20,
    "before_fields": {
      "title_en": "receipt",
      "title_ja": "領収書・レシート",
      "content": {
        "word": "receipt",
        "japanese": "領収書・レシート",
        "kanaReading": "リシート",
        "pronunciationHint": "The p is silent; stress CEIPT.",
        "exampleSentence": "Would you like a receipt?",
        "exampleJapanese": "レシートは必要ですか。",
        "commonMistake": "Do not pronounce the written p.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "shopping-and-money"
      },
      "icon": "🧾",
      "tags": [
        "shopping-and-money",
        "level-20",
        "receipt"
      ]
    },
    "after_fields": {
      "title_en": "receipt",
      "title_ja": "領収書・レシート",
      "content": {
        "word": "receipt",
        "japanese": "領収書・レシート",
        "kanaReading": "リシート",
        "pronunciationHint": "The p is silent; stress CEIPT.",
        "exampleSentence": "Would you like a receipt?",
        "exampleJapanese": "レシートは必要ですか。",
        "commonMistake": "Do not pronounce the written p.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ab6bb62ff34c165a.svg",
          "kind": "scene",
          "altEn": "A receipt lists a purchased item, its price, and the total paid.",
          "altJa": "購入品と値段、支払合計が書かれたレシート。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "shopping-and-money"
      },
      "icon": "",
      "tags": [
        "shopping-and-money",
        "level-20",
        "receipt"
      ]
    }
  },
  {
    "id": "word-l20-discount",
    "category": "words",
    "level": 20,
    "before_fields": {
      "title_en": "discount",
      "title_ja": "割引",
      "content": {
        "word": "discount",
        "japanese": "割引",
        "kanaReading": "ディスカウント",
        "pronunciationHint": "As a noun, stress DIS.",
        "exampleSentence": "This coupon gives a ten-percent discount.",
        "exampleJapanese": "このクーポンで10パーセント割引になります。",
        "commonMistake": "Say “a discount on an item,” not “discount of an item.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "shopping-and-money"
      },
      "icon": "💸",
      "tags": [
        "shopping-and-money",
        "level-20",
        "discount"
      ]
    },
    "after_fields": {
      "title_en": "discount",
      "title_ja": "割引",
      "content": {
        "word": "discount",
        "japanese": "割引",
        "kanaReading": "ディスカウント",
        "pronunciationHint": "As a noun, stress DIS.",
        "exampleSentence": "This coupon gives a ten-percent discount.",
        "exampleJapanese": "このクーポンで10パーセント割引になります。",
        "commonMistake": "Say “a discount on an item,” not “discount of an item.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-632608fa4da8b369.svg",
          "kind": "contrast",
          "altEn": "The price of the same shirt falls from ¥2,000 to ¥1,500.",
          "altJa": "同じシャツの値段が2,000円から1,500円に下がります。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "shopping-and-money"
      },
      "icon": "",
      "tags": [
        "shopping-and-money",
        "level-20",
        "discount"
      ]
    }
  },
  {
    "id": "word-l20-size",
    "category": "words",
    "level": 20,
    "before_fields": {
      "title_en": "size",
      "title_ja": "サイズ・大きさ",
      "content": {
        "word": "size",
        "japanese": "サイズ・大きさ",
        "kanaReading": "サイズ",
        "pronunciationHint": "Finish with voiced /z/.",
        "exampleSentence": "Do you have this in a larger size?",
        "exampleJapanese": "これのもっと大きいサイズはありますか。",
        "commonMistake": "Use “What size?” rather than “Which size are you?”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "shopping-and-money"
      },
      "icon": "📏",
      "tags": [
        "shopping-and-money",
        "level-20",
        "size"
      ]
    },
    "after_fields": {
      "title_en": "size",
      "title_ja": "サイズ・大きさ",
      "content": {
        "word": "size",
        "japanese": "サイズ・大きさ",
        "kanaReading": "サイズ",
        "pronunciationHint": "Finish with voiced /z/.",
        "exampleSentence": "Do you have this in a larger size?",
        "exampleJapanese": "これのもっと大きいサイズはありますか。",
        "commonMistake": "Use “What size?” rather than “Which size are you?”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5d5ef2b7644978d5.svg",
          "kind": "contrast",
          "altEn": "Small and large versions of the same clothing item.",
          "altJa": "同じ服の小さいサイズと大きいサイズ。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "shopping-and-money"
      },
      "icon": "",
      "tags": [
        "shopping-and-money",
        "level-20",
        "size"
      ]
    }
  },
  {
    "id": "word-l20-cheap",
    "category": "words",
    "level": 20,
    "before_fields": {
      "title_en": "cheap",
      "title_ja": "安い",
      "content": {
        "word": "cheap",
        "japanese": "安い",
        "kanaReading": "チープ",
        "pronunciationHint": "Use /tʃ/ and hold /iː/.",
        "exampleSentence": "The bag was cheap but sturdy.",
        "exampleJapanese": "そのかばんは安いけれど丈夫でした。",
        "commonMistake": "“Cheap” can imply low quality; use “inexpensive” for a neutral tone.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "shopping-and-money"
      },
      "icon": "🪙",
      "tags": [
        "shopping-and-money",
        "level-20",
        "cheap"
      ]
    },
    "after_fields": {
      "title_en": "cheap",
      "title_ja": "安い",
      "content": {
        "word": "cheap",
        "japanese": "安い",
        "kanaReading": "チープ",
        "pronunciationHint": "Use /tʃ/ and hold /iː/.",
        "exampleSentence": "The bag was cheap but sturdy.",
        "exampleJapanese": "そのかばんは安いけれど丈夫でした。",
        "commonMistake": "“Cheap” can imply low quality; use “inexpensive” for a neutral tone.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-cad5284c49d89b57.svg",
          "kind": "single",
          "altEn": "A bag has a low price tag.",
          "altJa": "かばんに安い値札がついています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "shopping-and-money"
      },
      "icon": "",
      "tags": [
        "shopping-and-money",
        "level-20",
        "cheap"
      ]
    }
  },
  {
    "id": "word-l20-expensive",
    "category": "words",
    "level": 20,
    "before_fields": {
      "title_en": "expensive",
      "title_ja": "高価な",
      "content": {
        "word": "expensive",
        "japanese": "高価な",
        "kanaReading": "イクスペンシヴ",
        "pronunciationHint": "Stress PEN.",
        "exampleSentence": "That jacket is too expensive for me.",
        "exampleJapanese": "その上着は私には高すぎます。",
        "commonMistake": "Say “expensive,” not “high price” as an adjective.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "shopping-and-money"
      },
      "icon": "💎",
      "tags": [
        "shopping-and-money",
        "level-20",
        "expensive"
      ]
    },
    "after_fields": {
      "title_en": "expensive",
      "title_ja": "高価な",
      "content": {
        "word": "expensive",
        "japanese": "高価な",
        "kanaReading": "イクスペンシヴ",
        "pronunciationHint": "Stress PEN.",
        "exampleSentence": "That jacket is too expensive for me.",
        "exampleJapanese": "その上着は私には高すぎます。",
        "commonMistake": "Say “expensive,” not “high price” as an adjective.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-e4438efd8b56cc0d.svg",
          "kind": "scene",
          "altEn": "A coat has a high price that requires much more money.",
          "altJa": "コートに高い値札がつき、たくさんのお金が必要です。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "shopping-and-money"
      },
      "icon": "",
      "tags": [
        "shopping-and-money",
        "level-20",
        "expensive"
      ]
    }
  },
  {
    "id": "word-l20-order",
    "category": "words",
    "level": 20,
    "before_fields": {
      "title_en": "order",
      "title_ja": "注文・注文する",
      "content": {
        "word": "order",
        "japanese": "注文・注文する",
        "kanaReading": "オーダー",
        "pronunciationHint": "Stress OR; pronounce r in US English.",
        "exampleSentence": "I ordered the soup without onions.",
        "exampleJapanese": "スープを玉ねぎ抜きで注文しました。",
        "commonMistake": "Use “order something,” not “order for something.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "shopping-and-money"
      },
      "icon": "🛒",
      "tags": [
        "shopping-and-money",
        "level-20",
        "order"
      ]
    },
    "after_fields": {
      "title_en": "order",
      "title_ja": "注文・注文する",
      "content": {
        "word": "order",
        "japanese": "注文・注文する",
        "kanaReading": "オーダー",
        "pronunciationHint": "Stress OR; pronounce r in US English.",
        "exampleSentence": "I ordered the soup without onions.",
        "exampleJapanese": "スープを玉ねぎ抜きで注文しました。",
        "commonMistake": "Use “order something,” not “order for something.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-89d479456459c25b.svg",
          "kind": "scene",
          "altEn": "A customer asks a waiter for a bowl of soup.",
          "altJa": "お客さんが店員にスープを注文しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "shopping-and-money"
      },
      "icon": "",
      "tags": [
        "shopping-and-money",
        "level-20",
        "order"
      ]
    }
  },
  {
    "id": "word-l21-neighbor",
    "category": "words",
    "level": 21,
    "before_fields": {
      "title_en": "neighbor",
      "title_ja": "近所の人",
      "content": {
        "word": "neighbor",
        "japanese": "近所の人",
        "kanaReading": "ネイバー",
        "pronunciationHint": "Use /eɪ/ and a voiced /b/.",
        "exampleSentence": "Our neighbor watered the plants for us.",
        "exampleJapanese": "近所の人が代わりに植物へ水をやってくれました。",
        "commonMistake": "US spelling is “neighbor”; UK spelling is “neighbour.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "relationships"
      },
      "icon": "🏘️",
      "tags": [
        "relationships",
        "level-21",
        "neighbor"
      ]
    },
    "after_fields": {
      "title_en": "neighbor",
      "title_ja": "近所の人",
      "content": {
        "word": "neighbor",
        "japanese": "近所の人",
        "kanaReading": "ネイバー",
        "pronunciationHint": "Use /eɪ/ and a voiced /b/.",
        "exampleSentence": "Our neighbor watered the plants for us.",
        "exampleJapanese": "近所の人が代わりに植物へ水をやってくれました。",
        "commonMistake": "US spelling is “neighbor”; UK spelling is “neighbour.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-83823d7fc176f37a.svg",
          "kind": "scene",
          "altEn": "People greet each other from two neighbouring houses.",
          "altJa": "隣り合う家の住人があいさつしています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "relationships"
      },
      "icon": "",
      "tags": [
        "relationships",
        "level-21",
        "neighbor"
      ]
    }
  },
  {
    "id": "word-l21-guest",
    "category": "words",
    "level": 21,
    "before_fields": {
      "title_en": "guest",
      "title_ja": "客・ゲスト",
      "content": {
        "word": "guest",
        "japanese": "客・ゲスト",
        "kanaReading": "ゲスト",
        "pronunciationHint": "The u is silent; start with hard g.",
        "exampleSentence": "Each guest received a name card.",
        "exampleJapanese": "客は一人ずつ名札を受け取りました。",
        "commonMistake": "Do not pronounce the written u.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "relationships"
      },
      "icon": "🛎️",
      "tags": [
        "relationships",
        "level-21",
        "guest"
      ]
    },
    "after_fields": {
      "title_en": "guest",
      "title_ja": "客・ゲスト",
      "content": {
        "word": "guest",
        "japanese": "客・ゲスト",
        "kanaReading": "ゲスト",
        "pronunciationHint": "The u is silent; start with hard g.",
        "exampleSentence": "We introduced each guest by name so nobody felt left out.",
        "exampleJapanese": "誰も取り残されたと感じないように、一人ずつ名前でお客さんを紹介しました。",
        "commonMistake": "Do not pronounce the written u.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-0aa689f4dec276fe.svg",
          "kind": "scene",
          "altEn": "A visitor waits at someone else’s front door.",
          "altJa": "招かれた人が訪問先の玄関に立っています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "relationships"
      },
      "icon": "",
      "tags": [
        "relationships",
        "level-21",
        "guest"
      ]
    }
  },
  {
    "id": "word-l21-host",
    "category": "words",
    "level": 21,
    "before_fields": {
      "title_en": "host",
      "title_ja": "主催者・迎える人",
      "content": {
        "word": "host",
        "japanese": "主催者・迎える人",
        "kanaReading": "ホウスト",
        "pronunciationHint": "Use /oʊ/ and finish with /st/.",
        "exampleSentence": "The host introduced everyone.",
        "exampleJapanese": "主催者が全員を紹介しました。",
        "commonMistake": "A host welcomes guests; it does not mean every event worker.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "relationships"
      },
      "icon": "🎙️",
      "tags": [
        "relationships",
        "level-21",
        "host"
      ]
    },
    "after_fields": {
      "title_en": "host",
      "title_ja": "主催者・迎える人",
      "content": {
        "word": "host",
        "japanese": "主催者・迎える人",
        "kanaReading": "ホウスト",
        "pronunciationHint": "Use /oʊ/ and finish with /st/.",
        "exampleSentence": "The host introduced everyone.",
        "exampleJapanese": "主催者が全員を紹介しました。",
        "commonMistake": "A host welcomes guests; it does not mean every event worker.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4b4ee098e5ff6ba1.svg",
          "kind": "scene",
          "altEn": "A host welcomes a visitor and offers food.",
          "altJa": "迎える側の人が訪問客に食事を出しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "relationships"
      },
      "icon": "",
      "tags": [
        "relationships",
        "level-21",
        "host"
      ]
    }
  },
  {
    "id": "word-l21-partner",
    "category": "words",
    "level": 21,
    "before_fields": {
      "title_en": "partner",
      "title_ja": "相手・協力者",
      "content": {
        "word": "partner",
        "japanese": "相手・協力者",
        "kanaReading": "パートナー",
        "pronunciationHint": "Stress PART; the second vowel is weak.",
        "exampleSentence": "Practice the dialogue with a partner.",
        "exampleJapanese": "相手と会話を練習してください。",
        "commonMistake": "“Partner” does not always mean a romantic partner.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "relationships"
      },
      "icon": "🤝",
      "tags": [
        "relationships",
        "level-21",
        "partner"
      ]
    },
    "after_fields": {
      "title_en": "partner",
      "title_ja": "相手・協力者",
      "content": {
        "word": "partner",
        "japanese": "相手・協力者",
        "kanaReading": "パートナー",
        "pronunciationHint": "Stress PART; the second vowel is weak.",
        "exampleSentence": "Check with your partner before making the final decision.",
        "exampleJapanese": "最終的な決定をする前に、一緒に取り組む相手に確認してください。",
        "commonMistake": "“Partner” does not always mean a romantic partner.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ec50c43664769ded.svg",
          "kind": "single",
          "altEn": "Two learning partners work on a page together.",
          "altJa": "二人の学習相手が一緒に課題に取り組んでいます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "relationships"
      },
      "icon": "",
      "tags": [
        "relationships",
        "level-21",
        "partner"
      ]
    }
  },
  {
    "id": "word-l21-team",
    "category": "words",
    "level": 21,
    "before_fields": {
      "title_en": "team",
      "title_ja": "チーム",
      "content": {
        "word": "team",
        "japanese": "チーム",
        "kanaReading": "チーム",
        "pronunciationHint": "Hold the long /iː/ vowel.",
        "exampleSentence": "Our team solved the problem together.",
        "exampleJapanese": "私たちのチームは一緒に問題を解決しました。",
        "commonMistake": "Say “on a team” in US English, often “in a team” in UK English.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "relationships"
      },
      "icon": "👨‍👩‍👧‍👦",
      "tags": [
        "relationships",
        "level-21",
        "team"
      ]
    },
    "after_fields": {
      "title_en": "team",
      "title_ja": "チーム",
      "content": {
        "word": "team",
        "japanese": "チーム",
        "kanaReading": "チーム",
        "pronunciationHint": "Hold the long /iː/ vowel.",
        "exampleSentence": "Our team solved the problem together.",
        "exampleJapanese": "私たちのチームは一緒に問題を解決しました。",
        "commonMistake": "Say “on a team” in US English, often “in a team” in UK English.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-1705c05b37994fd2.svg",
          "kind": "scene",
          "altEn": "Several people combine their work to complete one shared puzzle.",
          "altJa": "何人かが協力して一つのパズルを完成させます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "relationships"
      },
      "icon": "",
      "tags": [
        "relationships",
        "level-21",
        "team"
      ]
    }
  },
  {
    "id": "word-l21-promise",
    "category": "words",
    "level": 21,
    "before_fields": {
      "title_en": "promise",
      "title_ja": "約束・約束する",
      "content": {
        "word": "promise",
        "japanese": "約束・約束する",
        "kanaReading": "プロミス",
        "pronunciationHint": "Stress PROM; the final s is /s/.",
        "exampleSentence": "I promise to return it tomorrow.",
        "exampleJapanese": "明日返すと約束します。",
        "commonMistake": "Use “promise to do,” not “promise doing.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "relationships"
      },
      "icon": "🤞",
      "tags": [
        "relationships",
        "level-21",
        "promise"
      ]
    },
    "after_fields": {
      "title_en": "promise",
      "title_ja": "約束・約束する",
      "content": {
        "word": "promise",
        "japanese": "約束・約束する",
        "kanaReading": "プロミス",
        "pronunciationHint": "Stress PROM; the final s is /s/.",
        "exampleSentence": "I promise to return it tomorrow.",
        "exampleJapanese": "明日返すと約束します。",
        "commonMistake": "Use “promise to do,” not “promise doing.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-0dfe36a7e223c0e0.svg",
          "kind": "scene",
          "altEn": "A handshake and a marked date show a commitment to a future action.",
          "altJa": "握手と予定の日付で、これからすることを約束しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "relationships"
      },
      "icon": "",
      "tags": [
        "relationships",
        "level-21",
        "promise"
      ]
    }
  },
  {
    "id": "word-l21-trust",
    "category": "words",
    "level": 21,
    "before_fields": {
      "title_en": "trust",
      "title_ja": "信頼・信頼する",
      "content": {
        "word": "trust",
        "japanese": "信頼・信頼する",
        "kanaReading": "トラスト",
        "pronunciationHint": "Blend /tr/ and use short /ʌ/.",
        "exampleSentence": "It takes time to build trust.",
        "exampleJapanese": "信頼を築くには時間がかかります。",
        "commonMistake": "Use “trust someone,” not “trust in someone,” for ordinary confidence.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "relationships"
      },
      "icon": "🫶",
      "tags": [
        "relationships",
        "level-21",
        "trust"
      ]
    },
    "after_fields": {
      "title_en": "trust",
      "title_ja": "信頼・信頼する",
      "content": {
        "word": "trust",
        "japanese": "信頼・信頼する",
        "kanaReading": "トラスト",
        "pronunciationHint": "Blend /tr/ and use short /ʌ/.",
        "exampleSentence": "It takes time to build trust.",
        "exampleJapanese": "信頼を築くには時間がかかります。",
        "commonMistake": "“Trust someone” is the direct everyday pattern. “Trust in someone” can express strong faith and is also correct.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-2eb644dbbefdcdd2.svg",
          "kind": "scene",
          "altEn": "A person lets a helper guide them while their eyes are closed.",
          "altJa": "目を閉じた人が、信頼する相手の案内に身を任せています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "relationships"
      },
      "icon": "",
      "tags": [
        "relationships",
        "level-21",
        "trust"
      ]
    }
  },
  {
    "id": "word-l21-support",
    "category": "words",
    "level": 21,
    "before_fields": {
      "title_en": "support",
      "title_ja": "支援・支える",
      "content": {
        "word": "support",
        "japanese": "支援・支える",
        "kanaReading": "サポート",
        "pronunciationHint": "Stress PORT.",
        "exampleSentence": "Thank you for your support this week.",
        "exampleJapanese": "今週支えてくれてありがとう。",
        "commonMistake": "“Support” is usually uncountable as help.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "relationships"
      },
      "icon": "💪",
      "tags": [
        "relationships",
        "level-21",
        "support"
      ]
    },
    "after_fields": {
      "title_en": "support",
      "title_ja": "支援・支える",
      "content": {
        "word": "support",
        "japanese": "支援・支える",
        "kanaReading": "サポート",
        "pronunciationHint": "Stress PORT.",
        "exampleSentence": "Thank you for your support this week.",
        "exampleJapanese": "今週支えてくれてありがとう。",
        "commonMistake": "“Support” is usually uncountable as help.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-029e78852e096406.svg",
          "kind": "single",
          "altEn": "An illustration of support.",
          "altJa": "支援・支えるのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "relationships"
      },
      "icon": "",
      "tags": [
        "relationships",
        "level-21",
        "support"
      ]
    }
  },
  {
    "id": "word-l21-respect",
    "category": "words",
    "level": 21,
    "before_fields": {
      "title_en": "respect",
      "title_ja": "尊敬・尊重する",
      "content": {
        "word": "respect",
        "japanese": "尊敬・尊重する",
        "kanaReading": "リスペクト",
        "pronunciationHint": "As a noun, stress SPECT strongly.",
        "exampleSentence": "We respect each other’s opinions.",
        "exampleJapanese": "私たちは互いの意見を尊重します。",
        "commonMistake": "Use “respect someone,” without “to.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "relationships"
      },
      "icon": "🙇",
      "tags": [
        "relationships",
        "level-21",
        "respect"
      ]
    },
    "after_fields": {
      "title_en": "respect",
      "title_ja": "尊敬・尊重する",
      "content": {
        "word": "respect",
        "japanese": "尊敬・尊重する",
        "kanaReading": "リスペクト",
        "pronunciationHint": "Stress SPECT in both the noun and the verb.",
        "exampleSentence": "We respect each other’s opinions.",
        "exampleJapanese": "私たちは互いの意見を尊重します。",
        "commonMistake": "Use “respect someone,” without “to.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4b69ac9310599c8f.svg",
          "kind": "scene",
          "altEn": "One person listens attentively while another gives an opinion.",
          "altJa": "相手の意見を大切にして、注意深く聞いている人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "relationships"
      },
      "icon": "",
      "tags": [
        "relationships",
        "level-21",
        "respect"
      ]
    }
  },
  {
    "id": "word-l21-advice",
    "category": "words",
    "level": 21,
    "before_fields": {
      "title_en": "advice",
      "title_ja": "助言",
      "content": {
        "word": "advice",
        "japanese": "助言",
        "kanaReading": "アドヴァイス",
        "pronunciationHint": "Finish with unvoiced /s/.",
        "exampleSentence": "Her advice helped me decide.",
        "exampleJapanese": "彼女の助言が決断の助けになりました。",
        "commonMistake": "“Advice” is uncountable; say “a piece of advice.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "relationships"
      },
      "icon": "💡",
      "tags": [
        "relationships",
        "level-21",
        "advice"
      ]
    },
    "after_fields": {
      "title_en": "advice",
      "title_ja": "助言",
      "content": {
        "word": "advice",
        "japanese": "助言",
        "kanaReading": "アドヴァイス",
        "pronunciationHint": "Finish with unvoiced /s/.",
        "exampleSentence": "Her advice helped me decide.",
        "exampleJapanese": "彼女の助言が決断の助けになりました。",
        "commonMistake": "“Advice” is uncountable; say “a piece of advice.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-887f8f44c3bedbb4.svg",
          "kind": "scene",
          "altEn": "Someone points out a helpful route to a person deciding where to go.",
          "altJa": "行き方に迷う人へ、役立つ道を示して助言しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "relationships"
      },
      "icon": "",
      "tags": [
        "relationships",
        "level-21",
        "advice"
      ]
    }
  },
  {
    "id": "word-l22-available",
    "category": "words",
    "level": 22,
    "before_fields": {
      "title_en": "available",
      "title_ja": "利用できる・都合がつく",
      "content": {
        "word": "available",
        "japanese": "利用できる・都合がつく",
        "kanaReading": "アヴェイラブル",
        "pronunciationHint": "Stress VAIL; later syllables are light.",
        "exampleSentence": "Is this room available after three?",
        "exampleJapanese": "この部屋は3時以降空いていますか。",
        "commonMistake": "For people, “available” means free to meet, not always single.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "useful-adjectives"
      },
      "icon": "🟢",
      "tags": [
        "useful-adjectives",
        "level-22",
        "available"
      ]
    },
    "after_fields": {
      "title_en": "available",
      "title_ja": "利用できる・都合がつく",
      "content": {
        "word": "available",
        "japanese": "利用できる・都合がつく",
        "kanaReading": "アヴェイラブル",
        "pronunciationHint": "Stress VAIL; later syllables are light.",
        "exampleSentence": "Is this room available after three?",
        "exampleJapanese": "この部屋は3時以降空いていますか。",
        "commonMistake": "For people, “available” means free to meet, not always single.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5e054055756bc23c.svg",
          "kind": "contrast",
          "altEn": "One chair is occupied while the other is free to use.",
          "altJa": "一方の椅子は使用中、もう一方は空いています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "useful-adjectives"
      },
      "icon": "",
      "tags": [
        "useful-adjectives",
        "level-22",
        "available"
      ]
    }
  },
  {
    "id": "word-l22-convenient",
    "category": "words",
    "level": 22,
    "before_fields": {
      "title_en": "convenient",
      "title_ja": "便利な",
      "content": {
        "word": "convenient",
        "japanese": "便利な",
        "kanaReading": "コンヴィーニエント",
        "pronunciationHint": "Stress VEN.",
        "exampleSentence": "The later train is more convenient for me.",
        "exampleJapanese": "後の電車のほうが私には便利です。",
        "commonMistake": "Something is convenient for a person, not convenient to a person.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "useful-adjectives"
      },
      "icon": "👌",
      "tags": [
        "useful-adjectives",
        "level-22",
        "convenient"
      ]
    },
    "after_fields": {
      "title_en": "convenient",
      "title_ja": "便利な",
      "content": {
        "word": "convenient",
        "japanese": "便利な",
        "kanaReading": "コンヴィーニエント",
        "pronunciationHint": "Stress VEN.",
        "exampleSentence": "The later train is more convenient for me.",
        "exampleJapanese": "後の電車のほうが私には便利です。",
        "commonMistake": "Say “The time is convenient for me.” To describe your own availability, say “I’m free,” not “I’m convenient.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-df2f196711464108.svg",
          "kind": "scene",
          "altEn": "A station is a short easy walk from home.",
          "altJa": "家から駅まで歩いてすぐで便利な場面。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "useful-adjectives"
      },
      "icon": "",
      "tags": [
        "useful-adjectives",
        "level-22",
        "convenient"
      ]
    }
  },
  {
    "id": "word-l22-possible",
    "category": "words",
    "level": 22,
    "before_fields": {
      "title_en": "possible",
      "title_ja": "可能な",
      "content": {
        "word": "possible",
        "japanese": "可能な",
        "kanaReading": "ポッシブル",
        "pronunciationHint": "Stress POS; the ending is weak.",
        "exampleSentence": "Is it possible to change the date?",
        "exampleJapanese": "日付を変更することは可能ですか。",
        "commonMistake": "Say “It is possible to…,” not “It is possible that I can…” when simpler.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "useful-adjectives"
      },
      "icon": "🔓",
      "tags": [
        "useful-adjectives",
        "level-22",
        "possible"
      ]
    },
    "after_fields": {
      "title_en": "possible",
      "title_ja": "可能な",
      "content": {
        "word": "possible",
        "japanese": "可能な",
        "kanaReading": "ポッシブル",
        "pronunciationHint": "Stress POS; the ending is weak.",
        "exampleSentence": "Is it possible to change the date?",
        "exampleJapanese": "日付を変更することは可能ですか。",
        "commonMistake": "Use “It is possible to change it.” For personal ability, use “I can change it,” not “I am possible to change it.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-a4300c1fa7d7f9b5.svg",
          "kind": "scene",
          "altEn": "The last puzzle piece fits the gap, showing that the task can be done.",
          "altJa": "最後のピースが空所に合い、完成できることを示しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "useful-adjectives"
      },
      "icon": "",
      "tags": [
        "useful-adjectives",
        "level-22",
        "possible"
      ]
    }
  },
  {
    "id": "word-l22-necessary",
    "category": "words",
    "level": 22,
    "before_fields": {
      "title_en": "necessary",
      "title_ja": "必要な",
      "content": {
        "word": "necessary",
        "japanese": "必要な",
        "kanaReading": "ネセサリー",
        "pronunciationHint": "Stress NES; keep later syllables light.",
        "exampleSentence": "A reservation is not necessary today.",
        "exampleJapanese": "今日は予約は必要ありません。",
        "commonMistake": "Spell it with one c and two s letters.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "useful-adjectives"
      },
      "icon": "📌",
      "tags": [
        "useful-adjectives",
        "level-22",
        "necessary"
      ]
    },
    "after_fields": {
      "title_en": "necessary",
      "title_ja": "必要な",
      "content": {
        "word": "necessary",
        "japanese": "必要な",
        "kanaReading": "ネセサリー",
        "pronunciationHint": "Stress NES; keep later syllables light.",
        "exampleSentence": "A reservation is not necessary today.",
        "exampleJapanese": "今日は予約は必要ありません。",
        "commonMistake": "Spell it with one c and two s letters.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-dcab7e40765cdfa3.svg",
          "kind": "scene",
          "altEn": "A locked door cannot be opened until the matching key is used.",
          "altJa": "閉じたドアを開けるために鍵が必要です。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "useful-adjectives"
      },
      "icon": "",
      "tags": [
        "useful-adjectives",
        "level-22",
        "necessary"
      ]
    }
  },
  {
    "id": "word-l22-certain",
    "category": "words",
    "level": 22,
    "before_fields": {
      "title_en": "certain",
      "title_ja": "確かな・ある",
      "content": {
        "word": "certain",
        "japanese": "確かな・ある",
        "kanaReading": "サートゥン",
        "pronunciationHint": "The t is often softened; stress CER.",
        "exampleSentence": "I am certain that I locked the door.",
        "exampleJapanese": "ドアに鍵をかけたことは確かです。",
        "commonMistake": "“Certain” is stronger than “probably.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "useful-adjectives"
      },
      "icon": "✔️",
      "tags": [
        "useful-adjectives",
        "level-22",
        "certain"
      ]
    },
    "after_fields": {
      "title_en": "certain",
      "title_ja": "確信している・確かな",
      "content": {
        "word": "certain",
        "japanese": "確信している・確かな",
        "kanaReading": "サートゥン",
        "pronunciationHint": "The t is often softened; stress CER.",
        "exampleSentence": "I am certain that I locked the door.",
        "exampleJapanese": "ドアに鍵をかけたことは確かです。",
        "commonMistake": "“Certain” is stronger than “probably.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d1c2a99d2965d06d.svg",
          "kind": "scene",
          "altEn": "A person clearly remembers locking the door and is sure about it.",
          "altJa": "ドアに鍵をかけたことをはっきり覚え、確信しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "useful-adjectives"
      },
      "icon": "",
      "tags": [
        "useful-adjectives",
        "level-22",
        "certain"
      ]
    }
  },
  {
    "id": "word-l22-familiar",
    "category": "words",
    "level": 22,
    "before_fields": {
      "title_en": "familiar",
      "title_ja": "よく知っている・見覚えのある",
      "content": {
        "word": "familiar",
        "japanese": "よく知っている・見覚えのある",
        "kanaReading": "ファミリアー",
        "pronunciationHint": "Stress MIL: fa-MIL-iar.",
        "exampleSentence": "This song sounds familiar.",
        "exampleJapanese": "この曲は聞き覚えがあります。",
        "commonMistake": "Say “familiar with something,” not “familiar to something” for your knowledge.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "useful-adjectives"
      },
      "icon": "🎵",
      "tags": [
        "useful-adjectives",
        "level-22",
        "familiar"
      ]
    },
    "after_fields": {
      "title_en": "familiar",
      "title_ja": "よく知っている・見覚えのある",
      "content": {
        "word": "familiar",
        "japanese": "よく知っている・見覚えのある",
        "kanaReading": "ファミリアー",
        "pronunciationHint": "Stress MIL: fa-MIL-iar.",
        "exampleSentence": "This song sounds familiar.",
        "exampleJapanese": "この曲は聞き覚えがあります。",
        "commonMistake": "Say “familiar with something,” not “familiar to something” for your knowledge.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-de855bf27bce8176.svg",
          "kind": "scene",
          "altEn": "Hearing a tune brings back a clear memory of the same tune.",
          "altJa": "聞いた曲が記憶とつながり、聞き覚えがあると感じています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "useful-adjectives"
      },
      "icon": "",
      "tags": [
        "useful-adjectives",
        "level-22",
        "familiar"
      ]
    }
  },
  {
    "id": "word-l22-polite",
    "category": "words",
    "level": 22,
    "before_fields": {
      "title_en": "polite",
      "title_ja": "礼儀正しい",
      "content": {
        "word": "polite",
        "japanese": "礼儀正しい",
        "kanaReading": "ポライト",
        "pronunciationHint": "Stress LITE and use /aɪ/.",
        "exampleSentence": "It is polite to wait your turn.",
        "exampleJapanese": "順番を待つのは礼儀正しいことです。",
        "commonMistake": "“Polite” describes behavior; “kind” describes caring.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "useful-adjectives"
      },
      "icon": "🙏",
      "tags": [
        "useful-adjectives",
        "level-22",
        "polite"
      ]
    },
    "after_fields": {
      "title_en": "polite",
      "title_ja": "礼儀正しい",
      "content": {
        "word": "polite",
        "japanese": "礼儀正しい",
        "kanaReading": "ポライト",
        "pronunciationHint": "Stress LITE and use /aɪ/.",
        "exampleSentence": "It is polite to wait your turn.",
        "exampleJapanese": "順番を待つのは礼儀正しいことです。",
        "commonMistake": "“Polite” describes behavior; “kind” describes caring.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-14a937dcfe640853.svg",
          "kind": "scene",
          "altEn": "Someone opens the door for a visitor and lets them go first.",
          "altJa": "訪問客のためにドアを開け、先にどうぞと案内します。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "useful-adjectives"
      },
      "icon": "",
      "tags": [
        "useful-adjectives",
        "level-22",
        "polite"
      ]
    }
  },
  {
    "id": "word-l22-honest",
    "category": "words",
    "level": 22,
    "before_fields": {
      "title_en": "honest",
      "title_ja": "正直な",
      "content": {
        "word": "honest",
        "japanese": "正直な",
        "kanaReading": "オネスト",
        "pronunciationHint": "The h is silent; stress HON.",
        "exampleSentence": "Please give me an honest answer.",
        "exampleJapanese": "正直な答えをください。",
        "commonMistake": "Use “honest with someone” and “honest about something.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "useful-adjectives"
      },
      "icon": "🪞",
      "tags": [
        "useful-adjectives",
        "level-22",
        "honest"
      ]
    },
    "after_fields": {
      "title_en": "honest",
      "title_ja": "正直な",
      "content": {
        "word": "honest",
        "japanese": "正直な",
        "kanaReading": "オネスト",
        "pronunciationHint": "The h is silent; stress HON.",
        "exampleSentence": "Please give me an honest answer.",
        "exampleJapanese": "正直な答えをください。",
        "commonMistake": "Use “honest with someone” and “honest about something.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ae9b09a5503304b5.svg",
          "kind": "scene",
          "altEn": "A person admits that they broke the object rather than hiding it.",
          "altJa": "物を壊したことを隠さず、自分だと伝える人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "useful-adjectives"
      },
      "icon": "",
      "tags": [
        "useful-adjectives",
        "level-22",
        "honest"
      ]
    }
  },
  {
    "id": "word-l22-patient",
    "category": "words",
    "level": 22,
    "before_fields": {
      "title_en": "patient",
      "title_ja": "辛抱強い・患者",
      "content": {
        "word": "patient",
        "japanese": "辛抱強い・患者",
        "kanaReading": "ペイシェント",
        "pronunciationHint": "Stress PA and pronounce ti as /ʃ/.",
        "exampleSentence": "Our instructor was patient with beginners.",
        "exampleJapanese": "先生は初心者に辛抱強く接しました。",
        "commonMistake": "Do not confuse adjective “patient” with noun “patient.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "useful-adjectives"
      },
      "icon": "🧘",
      "tags": [
        "useful-adjectives",
        "level-22",
        "patient"
      ]
    },
    "after_fields": {
      "title_en": "patient",
      "title_ja": "辛抱強い",
      "content": {
        "word": "patient",
        "japanese": "辛抱強い",
        "kanaReading": "ペイシェント",
        "pronunciationHint": "Stress PA and pronounce ti as /ʃ/.",
        "exampleSentence": "Our instructor was patient with beginners.",
        "exampleJapanese": "先生は初心者に辛抱強く接しました。",
        "commonMistake": "As an adjective, say “be patient with someone.” “A patient” is a different meaning: a person receiving medical care.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d1154da0cf029897.svg",
          "kind": "scene",
          "altEn": "A person waits calmly without rushing anyone.",
          "altJa": "相手を急がせず、落ち着いて待っている人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "useful-adjectives"
      },
      "icon": "",
      "tags": [
        "useful-adjectives",
        "level-22",
        "patient"
      ]
    }
  },
  {
    "id": "word-l22-careful",
    "category": "words",
    "level": 22,
    "before_fields": {
      "title_en": "careful",
      "title_ja": "注意深い",
      "content": {
        "word": "careful",
        "japanese": "注意深い",
        "kanaReading": "ケアフル",
        "pronunciationHint": "Stress CARE; the ending is weak.",
        "exampleSentence": "Be careful with the hot plate.",
        "exampleJapanese": "熱い皿に気をつけてください。",
        "commonMistake": "Say “careful with” an object and “careful about” a decision.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "useful-adjectives"
      },
      "icon": "⚠️",
      "tags": [
        "useful-adjectives",
        "level-22",
        "careful"
      ]
    },
    "after_fields": {
      "title_en": "careful",
      "title_ja": "注意深い",
      "content": {
        "word": "careful",
        "japanese": "注意深い",
        "kanaReading": "ケアフル",
        "pronunciationHint": "Stress CARE; the ending is weak.",
        "exampleSentence": "Be careful not to share the wrong file.",
        "exampleJapanese": "間違ったファイルを共有しないように気をつけてください。",
        "commonMistake": "Say “careful with” an object and “careful about” a decision.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-3ef5a9d26ef3d950.svg",
          "kind": "scene",
          "altEn": "A person slowly carries a hot drink, watching not to spill it.",
          "altJa": "こぼさないように熱い飲み物を慎重に運んでいます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "useful-adjectives"
      },
      "icon": "",
      "tags": [
        "useful-adjectives",
        "level-22",
        "careful"
      ]
    }
  },
  {
    "id": "word-l23-arrive",
    "category": "words",
    "level": 23,
    "before_fields": {
      "title_en": "arrive",
      "title_ja": "到着する",
      "content": {
        "word": "arrive",
        "japanese": "到着する",
        "kanaReading": "アライヴ",
        "pronunciationHint": "Stress RIVE and finish with voiced v.",
        "exampleSentence": "We arrived at the venue before noon.",
        "exampleJapanese": "私たちは正午前に会場へ着きました。",
        "commonMistake": "Use “arrive at” a place and “arrive in” a city or country.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "plans-and-logistics"
      },
      "icon": "📍",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "arrive"
      ]
    },
    "after_fields": {
      "title_en": "arrive",
      "title_ja": "到着する",
      "content": {
        "word": "arrive",
        "japanese": "到着する",
        "kanaReading": "アライヴ",
        "pronunciationHint": "Stress RIVE and finish with voiced v.",
        "exampleSentence": "We arrived at the venue before noon.",
        "exampleJapanese": "私たちは正午前に会場へ着きました。",
        "commonMistake": "Use “arrive at” a place and “arrive in” a city or country.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-42c7026d7e766212.svg",
          "kind": "single",
          "altEn": "An illustration of arrive.",
          "altJa": "到着するのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "plans-and-logistics"
      },
      "icon": "",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "arrive"
      ]
    }
  },
  {
    "id": "word-l23-leave",
    "category": "words",
    "level": 23,
    "before_fields": {
      "title_en": "leave",
      "title_ja": "出発する・置いていく",
      "content": {
        "word": "leave",
        "japanese": "出発する・置いていく",
        "kanaReading": "リーヴ",
        "pronunciationHint": "Hold /iː/ and finish with voiced v.",
        "exampleSentence": "The first bus leaves at six.",
        "exampleJapanese": "始発バスは6時に出ます。",
        "commonMistake": "“Leave” can mean depart or intentionally/accidentally keep something behind.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "plans-and-logistics"
      },
      "icon": "🚪",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "leave"
      ]
    },
    "after_fields": {
      "title_en": "leave",
      "title_ja": "出発する・置いていく",
      "content": {
        "word": "leave",
        "japanese": "出発する・置いていく",
        "kanaReading": "リーヴ",
        "pronunciationHint": "Hold /iː/ and finish with voiced v.",
        "exampleSentence": "The first bus leaves at six.",
        "exampleJapanese": "始発バスは6時に出ます。",
        "commonMistake": "“Leave” can mean depart or intentionally/accidentally keep something behind.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-0167f70ba3d13754.svg",
          "kind": "single",
          "altEn": "An illustration of leave.",
          "altJa": "出発する・置いていくのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "plans-and-logistics"
      },
      "icon": "",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "leave"
      ]
    }
  },
  {
    "id": "word-l23-miss",
    "category": "words",
    "level": 23,
    "before_fields": {
      "title_en": "miss",
      "title_ja": "逃す・恋しく思う",
      "content": {
        "word": "miss",
        "japanese": "逃す・恋しく思う",
        "kanaReading": "ミス",
        "pronunciationHint": "Use short /ɪ/ and final /s/.",
        "exampleSentence": "I missed the train by one minute.",
        "exampleJapanese": "1分差で電車に乗り遅れました。",
        "commonMistake": "Say “miss the bus,” not “miss to the bus.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "plans-and-logistics"
      },
      "icon": "💨",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "miss"
      ]
    },
    "after_fields": {
      "title_en": "miss",
      "title_ja": "逃す・恋しく思う",
      "content": {
        "word": "miss",
        "japanese": "逃す・恋しく思う",
        "kanaReading": "ミス",
        "pronunciationHint": "Use short /ɪ/ and final /s/.",
        "exampleSentence": "I missed the train by one minute.",
        "exampleJapanese": "1分差で電車に乗り遅れました。",
        "commonMistake": "Say “miss the bus,” not “miss to the bus.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ceb3a8c68acffd13.svg",
          "kind": "single",
          "altEn": "An illustration of miss.",
          "altJa": "逃す・恋しく思うのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "plans-and-logistics"
      },
      "icon": "",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "miss"
      ]
    }
  },
  {
    "id": "word-l23-catch",
    "category": "words",
    "level": 23,
    "before_fields": {
      "title_en": "catch",
      "title_ja": "つかむ・間に合う",
      "content": {
        "word": "catch",
        "japanese": "つかむ・間に合う",
        "kanaReading": "キャッチ",
        "pronunciationHint": "Use /æ/ and finish /tʃ/.",
        "exampleSentence": "We can catch the express train.",
        "exampleJapanese": "急行電車に間に合います。",
        "commonMistake": "The past form is “caught,” not “catched.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "plans-and-logistics"
      },
      "icon": "🫴",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "catch"
      ]
    },
    "after_fields": {
      "title_en": "catch",
      "title_ja": "つかむ・間に合う",
      "content": {
        "word": "catch",
        "japanese": "つかむ・間に合う",
        "kanaReading": "キャッチ",
        "pronunciationHint": "Use /æ/ and finish /tʃ/.",
        "exampleSentence": "We can catch the express train.",
        "exampleJapanese": "急行電車に間に合います。",
        "commonMistake": "The past form is “caught,” not “catched.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-bc7cfe67ab98d00b.svg",
          "kind": "sequence",
          "altEn": "A person runs to a bus and gets on before it leaves.",
          "altJa": "バスへ走り、出発前に乗れた人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "plans-and-logistics"
      },
      "icon": "",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "catch"
      ]
    }
  },
  {
    "id": "word-l23-cancel",
    "category": "words",
    "level": 23,
    "before_fields": {
      "title_en": "cancel",
      "title_ja": "取り消す",
      "content": {
        "word": "cancel",
        "japanese": "取り消す",
        "kanaReading": "キャンセル",
        "pronunciationHint": "Stress CAN; the second vowel is weak.",
        "exampleSentence": "They canceled the outdoor event.",
        "exampleJapanese": "彼らは屋外イベントを中止しました。",
        "commonMistake": "US past spelling may be “canceled”; UK commonly uses “cancelled.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "plans-and-logistics"
      },
      "icon": "❌",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "cancel"
      ]
    },
    "after_fields": {
      "title_en": "cancel",
      "title_ja": "取り消す",
      "content": {
        "word": "cancel",
        "japanese": "取り消す",
        "kanaReading": "キャンセル",
        "pronunciationHint": "Stress CAN; the second vowel is weak.",
        "exampleSentence": "They canceled the outdoor event.",
        "exampleJapanese": "彼らは屋外イベントを中止しました。",
        "commonMistake": "US past spelling may be “canceled”; UK commonly uses “cancelled.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-e87993085e11b824.svg",
          "kind": "scene",
          "altEn": "A scheduled class is crossed out and will not happen.",
          "altJa": "予定していた授業に取り消しの印がついています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "plans-and-logistics"
      },
      "icon": "",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "cancel"
      ]
    }
  },
  {
    "id": "word-l23-delay",
    "category": "words",
    "level": 23,
    "before_fields": {
      "title_en": "delay",
      "title_ja": "遅らせる・遅延",
      "content": {
        "word": "delay",
        "japanese": "遅らせる・遅延",
        "kanaReading": "ディレイ",
        "pronunciationHint": "Stress LAY.",
        "exampleSentence": "Heavy rain delayed our flight.",
        "exampleJapanese": "大雨で飛行機が遅れました。",
        "commonMistake": "Use “be delayed,” not “be delay.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "plans-and-logistics"
      },
      "icon": "🕒",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "delay"
      ]
    },
    "after_fields": {
      "title_en": "delay",
      "title_ja": "遅らせる・遅延",
      "content": {
        "word": "delay",
        "japanese": "遅らせる・遅延",
        "kanaReading": "ディレイ",
        "pronunciationHint": "Stress LAY.",
        "exampleSentence": "Heavy rain delayed our flight.",
        "exampleJapanese": "大雨で飛行機が遅れました。",
        "commonMistake": "Use “be delayed,” not “be delay.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-bf05dcf96ac93eb1.svg",
          "kind": "contrast",
          "altEn": "A train’s departure moves from 9:00 to 9:30.",
          "altJa": "電車の出発が9時から9時30分へ遅れています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "plans-and-logistics"
      },
      "icon": "",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "delay"
      ]
    }
  },
  {
    "id": "word-l23-reserve",
    "category": "words",
    "level": 23,
    "before_fields": {
      "title_en": "reserve",
      "title_ja": "予約する・取っておく",
      "content": {
        "word": "reserve",
        "japanese": "予約する・取っておく",
        "kanaReading": "リザーヴ",
        "pronunciationHint": "Stress SERVE.",
        "exampleSentence": "I reserved a table by the window.",
        "exampleJapanese": "窓際の席を予約しました。",
        "commonMistake": "Reserve a table or room; book is often more conversational.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "plans-and-logistics"
      },
      "icon": "🪑",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "reserve"
      ]
    },
    "after_fields": {
      "title_en": "reserve",
      "title_ja": "予約する・取っておく",
      "content": {
        "word": "reserve",
        "japanese": "予約する・取っておく",
        "kanaReading": "リザーヴ",
        "pronunciationHint": "Stress SERVE.",
        "exampleSentence": "I reserved a table by the window.",
        "exampleJapanese": "窓際の席を予約しました。",
        "commonMistake": "Reserve a table or room; book is often more conversational.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-760917916f5059c0.svg",
          "kind": "scene",
          "altEn": "A table is set aside for two people at a chosen time.",
          "altJa": "決めた時刻に二人で使えるよう、席を予約しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "plans-and-logistics"
      },
      "icon": "",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "reserve"
      ]
    }
  },
  {
    "id": "word-l23-confirm",
    "category": "words",
    "level": 23,
    "before_fields": {
      "title_en": "confirm",
      "title_ja": "確認する",
      "content": {
        "word": "confirm",
        "japanese": "確認する",
        "kanaReading": "コンファーム",
        "pronunciationHint": "Stress FIRM.",
        "exampleSentence": "Please confirm your name and address.",
        "exampleJapanese": "お名前と住所をご確認ください。",
        "commonMistake": "“Confirm” means establish as correct, not simply look at.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "plans-and-logistics"
      },
      "icon": "✅",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "confirm"
      ]
    },
    "after_fields": {
      "title_en": "confirm",
      "title_ja": "確認する",
      "content": {
        "word": "confirm",
        "japanese": "確認する",
        "kanaReading": "コンファーム",
        "pronunciationHint": "Stress FIRM.",
        "exampleSentence": "Please confirm your name and address.",
        "exampleJapanese": "お名前と住所をご確認ください。",
        "commonMistake": "“Confirm” means establish as correct, not simply look at.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5c0dbd3bbd49948a.svg",
          "kind": "scene",
          "altEn": "A person checks an appointment’s date and time and confirms it is right.",
          "altJa": "予約の日付と時刻を確かめ、正しいと確認します。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "plans-and-logistics"
      },
      "icon": "",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "confirm"
      ]
    }
  },
  {
    "id": "word-l23-prepare",
    "category": "words",
    "level": 23,
    "before_fields": {
      "title_en": "prepare",
      "title_ja": "準備する",
      "content": {
        "word": "prepare",
        "japanese": "準備する",
        "kanaReading": "プリペア",
        "pronunciationHint": "Stress PARE.",
        "exampleSentence": "I prepared a short introduction.",
        "exampleJapanese": "短い自己紹介を準備しました。",
        "commonMistake": "Use “prepare for an event” but “prepare something” without “for.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "plans-and-logistics"
      },
      "icon": "🧰",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "prepare"
      ]
    },
    "after_fields": {
      "title_en": "prepare",
      "title_ja": "準備する",
      "content": {
        "word": "prepare",
        "japanese": "準備する",
        "kanaReading": "プリペア",
        "pronunciationHint": "Stress PARE.",
        "exampleSentence": "I prepared a short introduction.",
        "exampleJapanese": "短い自己紹介を準備しました。",
        "commonMistake": "Use “prepare for an event” but “prepare something” without “for.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-e17ad96ac6ed90e1.svg",
          "kind": "sequence",
          "altEn": "Packing needed items makes someone ready to leave.",
          "altJa": "必要な物を用意し、出発の準備が整います。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "plans-and-logistics"
      },
      "icon": "",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "prepare"
      ]
    }
  },
  {
    "id": "word-l23-deliver",
    "category": "words",
    "level": 23,
    "before_fields": {
      "title_en": "deliver",
      "title_ja": "配達する・伝える",
      "content": {
        "word": "deliver",
        "japanese": "配達する・伝える",
        "kanaReading": "デリヴァー",
        "pronunciationHint": "Stress LIV.",
        "exampleSentence": "They deliver groceries in the evening.",
        "exampleJapanese": "その店は夕方に食料品を配達します。",
        "commonMistake": "“Deliver something to someone” is the clearest basic pattern; a double-object pattern is also possible in some contexts.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "plans-and-logistics"
      },
      "icon": "🚚",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "deliver"
      ]
    },
    "after_fields": {
      "title_en": "deliver",
      "title_ja": "配達する・伝える",
      "content": {
        "word": "deliver",
        "japanese": "配達する・伝える",
        "kanaReading": "デリヴァー",
        "pronunciationHint": "Stress LIV.",
        "exampleSentence": "They deliver groceries in the evening.",
        "exampleJapanese": "その店は夕方に食料品を配達します。",
        "commonMistake": "“Deliver something to someone” is the clearest basic pattern; a double-object pattern is also possible in some contexts.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ca820a61444e54e3.svg",
          "kind": "single",
          "altEn": "An illustration of deliver.",
          "altJa": "配達する・伝えるのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "plans-and-logistics"
      },
      "icon": "",
      "tags": [
        "plans-and-logistics",
        "level-23",
        "deliver"
      ]
    }
  },
  {
    "id": "word-l24-device",
    "category": "words",
    "level": 24,
    "before_fields": {
      "title_en": "device",
      "title_ja": "機器・端末",
      "content": {
        "word": "device",
        "japanese": "機器・端末",
        "kanaReading": "ディヴァイス",
        "pronunciationHint": "Stress VICE and finish with /s/.",
        "exampleSentence": "Restart the device after the update.",
        "exampleJapanese": "更新後に端末を再起動してください。",
        "commonMistake": "“Device” is broad; name the phone or tablet when specificity helps.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "technology"
      },
      "icon": "📱",
      "tags": [
        "technology",
        "level-24",
        "device"
      ]
    },
    "after_fields": {
      "title_en": "device",
      "title_ja": "機器・端末",
      "content": {
        "word": "device",
        "japanese": "機器・端末",
        "kanaReading": "ディヴァイス",
        "pronunciationHint": "Stress VICE and finish with /s/.",
        "exampleSentence": "Restart the device after the update.",
        "exampleJapanese": "更新後に端末を再起動してください。",
        "commonMistake": "“Device” is broad; name the phone or tablet when specificity helps.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7151d39d43b3f7a4.svg",
          "kind": "contrast",
          "altEn": "A laptop and a mobile phone are two kinds of electronic device.",
          "altJa": "ノートパソコンと携帯電話という電子機器。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "technology"
      },
      "icon": "",
      "tags": [
        "technology",
        "level-24",
        "device"
      ]
    }
  },
  {
    "id": "word-l24-screen",
    "category": "words",
    "level": 24,
    "before_fields": {
      "title_en": "screen",
      "title_ja": "画面",
      "content": {
        "word": "screen",
        "japanese": "画面",
        "kanaReading": "スクリーン",
        "pronunciationHint": "Blend /skr/ and hold /iː/.",
        "exampleSentence": "The text is too small on this screen.",
        "exampleJapanese": "この画面では文字が小さすぎます。",
        "commonMistake": "Say “on the screen,” not “in the screen.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "technology"
      },
      "icon": "🖥️",
      "tags": [
        "technology",
        "level-24",
        "screen"
      ]
    },
    "after_fields": {
      "title_en": "screen",
      "title_ja": "画面",
      "content": {
        "word": "screen",
        "japanese": "画面",
        "kanaReading": "スクリーン",
        "pronunciationHint": "Blend /skr/ and hold /iː/.",
        "exampleSentence": "The text is too small on this screen.",
        "exampleJapanese": "この画面では文字が小さすぎます。",
        "commonMistake": "Say “on the screen,” not “in the screen.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-265a6b8ca7a4442f.svg",
          "kind": "single",
          "altEn": "An illustration of screen.",
          "altJa": "画面のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "technology"
      },
      "icon": "",
      "tags": [
        "technology",
        "level-24",
        "screen"
      ]
    }
  },
  {
    "id": "word-l24-charger",
    "category": "words",
    "level": 24,
    "before_fields": {
      "title_en": "charger",
      "title_ja": "充電器",
      "content": {
        "word": "charger",
        "japanese": "充電器",
        "kanaReading": "チャージャー",
        "pronunciationHint": "Begin /tʃ/ and stress CHAR.",
        "exampleSentence": "I packed the wrong charger.",
        "exampleJapanese": "間違った充電器を荷物に入れました。",
        "commonMistake": "A charger supplies power; a cable alone may not be a charger.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "technology"
      },
      "icon": "🔌",
      "tags": [
        "technology",
        "level-24",
        "charger"
      ]
    },
    "after_fields": {
      "title_en": "charger",
      "title_ja": "充電器",
      "content": {
        "word": "charger",
        "japanese": "充電器",
        "kanaReading": "チャージャー",
        "pronunciationHint": "Begin /tʃ/ and stress CHAR.",
        "exampleSentence": "I packed the wrong charger.",
        "exampleJapanese": "間違った充電器を荷物に入れました。",
        "commonMistake": "A charger supplies power; a cable alone may not be a charger.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-8b9b1be5bfe23e85.svg",
          "kind": "single",
          "altEn": "An illustration of charger.",
          "altJa": "充電器のイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "technology"
      },
      "icon": "",
      "tags": [
        "technology",
        "level-24",
        "charger"
      ]
    }
  },
  {
    "id": "word-l24-battery",
    "category": "words",
    "level": 24,
    "before_fields": {
      "title_en": "battery",
      "title_ja": "電池・バッテリー",
      "content": {
        "word": "battery",
        "japanese": "電池・バッテリー",
        "kanaReading": "バッテリー",
        "pronunciationHint": "Stress BAT; US speech often softens the t.",
        "exampleSentence": "My battery is very low.",
        "exampleJapanese": "バッテリー残量がほとんどありません。",
        "commonMistake": "Say “the battery is low,” not usually “the battery is little.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "technology"
      },
      "icon": "🔋",
      "tags": [
        "technology",
        "level-24",
        "battery"
      ]
    },
    "after_fields": {
      "title_en": "battery",
      "title_ja": "電池・バッテリー",
      "content": {
        "word": "battery",
        "japanese": "電池・バッテリー",
        "kanaReading": "バッテリー",
        "pronunciationHint": "Stress BAT; US speech often softens the t.",
        "exampleSentence": "My battery is very low.",
        "exampleJapanese": "バッテリー残量がほとんどありません。",
        "commonMistake": "Say “the battery is low,” not usually “the battery is little.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-859ca7acfe65f7d2.svg",
          "kind": "single",
          "altEn": "An illustration of battery.",
          "altJa": "電池・バッテリーのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "technology"
      },
      "icon": "",
      "tags": [
        "technology",
        "level-24",
        "battery"
      ]
    }
  },
  {
    "id": "word-l24-password",
    "category": "words",
    "level": 24,
    "before_fields": {
      "title_en": "password",
      "title_ja": "パスワード",
      "content": {
        "word": "password",
        "japanese": "パスワード",
        "kanaReading": "パスワード",
        "pronunciationHint": "Stress PASS and connect both parts.",
        "exampleSentence": "Choose a unique password for this account.",
        "exampleJapanese": "このアカウントには固有のパスワードを選んでください。",
        "commonMistake": "Do not share or reuse passwords.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "technology"
      },
      "icon": "🔐",
      "tags": [
        "technology",
        "level-24",
        "password"
      ]
    },
    "after_fields": {
      "title_en": "password",
      "title_ja": "パスワード",
      "content": {
        "word": "password",
        "japanese": "パスワード",
        "kanaReading": "パスワード",
        "pronunciationHint": "Stress PASS and connect both parts.",
        "exampleSentence": "I forgot my password and had to reset it.",
        "exampleJapanese": "パスワードを忘れたので、再設定しなければなりませんでした。",
        "commonMistake": "“Reset a password” means choose a new one after losing access. “Forget” describes what happened to your memory.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-33e8aca87f38321f.svg",
          "kind": "scene",
          "altEn": "A sign-in box hides typed password characters behind dots.",
          "altJa": "ログイン画面で、入力したパスワードが点で隠れています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "technology"
      },
      "icon": "",
      "tags": [
        "technology",
        "level-24",
        "password"
      ]
    }
  },
  {
    "id": "word-l24-account",
    "category": "words",
    "level": 24,
    "before_fields": {
      "title_en": "account",
      "title_ja": "アカウント・口座",
      "content": {
        "word": "account",
        "japanese": "アカウント・口座",
        "kanaReading": "アカウント",
        "pronunciationHint": "Stress COUNT.",
        "exampleSentence": "I created a separate study account.",
        "exampleJapanese": "学習用に別のアカウントを作りました。",
        "commonMistake": "Use “log in to an account,” not “login an account.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "technology"
      },
      "icon": "👤",
      "tags": [
        "technology",
        "level-24",
        "account"
      ]
    },
    "after_fields": {
      "title_en": "account",
      "title_ja": "アカウント・口座",
      "content": {
        "word": "account",
        "japanese": "アカウント・口座",
        "kanaReading": "アカウント",
        "pronunciationHint": "Stress COUNT.",
        "exampleSentence": "I created a separate study account.",
        "exampleJapanese": "学習用に別のアカウントを作りました。",
        "commonMistake": "Use “log in to an account,” not “login an account.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7d37d58b25400348.svg",
          "kind": "scene",
          "altEn": "A personal learning profile has its own name and saved work.",
          "altJa": "自分の名前と学習内容がある個人用アカウント。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "technology"
      },
      "icon": "",
      "tags": [
        "technology",
        "level-24",
        "account"
      ]
    }
  },
  {
    "id": "word-l24-update",
    "category": "words",
    "level": 24,
    "before_fields": {
      "title_en": "update",
      "title_ja": "更新・更新する",
      "content": {
        "word": "update",
        "japanese": "更新・更新する",
        "kanaReading": "アップデイト",
        "pronunciationHint": "As a verb, stress DATE; as a noun, often stress UP.",
        "exampleSentence": "Please update the app tonight.",
        "exampleJapanese": "今夜アプリを更新してください。",
        "commonMistake": "“Update” changes existing software; “upgrade” moves to a higher version or plan.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "technology"
      },
      "icon": "🔄",
      "tags": [
        "technology",
        "level-24",
        "update"
      ]
    },
    "after_fields": {
      "title_en": "update",
      "title_ja": "更新・更新する",
      "content": {
        "word": "update",
        "japanese": "更新・更新する",
        "kanaReading": "アップデイト",
        "pronunciationHint": "As a verb, stress DATE; as a noun, often stress UP.",
        "exampleSentence": "Please update the app tonight.",
        "exampleJapanese": "今夜アプリを更新してください。",
        "commonMistake": "“Update” changes existing software; “upgrade” moves to a higher version or plan.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-bb87fb8d4042dc9b.svg",
          "kind": "sequence",
          "altEn": "An installed app changes from an old version to a newer version.",
          "altJa": "入っているアプリを新しいバージョンに更新します。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "technology"
      },
      "icon": "",
      "tags": [
        "technology",
        "level-24",
        "update"
      ]
    }
  },
  {
    "id": "word-l24-download",
    "category": "words",
    "level": 24,
    "before_fields": {
      "title_en": "download",
      "title_ja": "ダウンロードする",
      "content": {
        "word": "download",
        "japanese": "ダウンロードする",
        "kanaReading": "ダウンロウド",
        "pronunciationHint": "As a verb, usually stress LOAD.",
        "exampleSentence": "Download the worksheet before class.",
        "exampleJapanese": "授業前にワークシートをダウンロードしてください。",
        "commonMistake": "A download moves data to your device; upload sends it away.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "technology"
      },
      "icon": "⬇️",
      "tags": [
        "technology",
        "level-24",
        "download"
      ]
    },
    "after_fields": {
      "title_en": "download",
      "title_ja": "ダウンロードする",
      "content": {
        "word": "download",
        "japanese": "ダウンロードする",
        "kanaReading": "ダウンロウド",
        "pronunciationHint": "As a verb, usually stress LOAD.",
        "exampleSentence": "Download the worksheet before class.",
        "exampleJapanese": "授業前にワークシートをダウンロードしてください。",
        "commonMistake": "A download moves data to your device; upload sends it away.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b9e47bf520c934a1.svg",
          "kind": "single",
          "altEn": "An illustration of download.",
          "altJa": "ダウンロードするのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "technology"
      },
      "icon": "",
      "tags": [
        "technology",
        "level-24",
        "download"
      ]
    }
  },
  {
    "id": "word-l24-upload",
    "category": "words",
    "level": 24,
    "before_fields": {
      "title_en": "upload",
      "title_ja": "アップロードする",
      "content": {
        "word": "upload",
        "japanese": "アップロードする",
        "kanaReading": "アップロウド",
        "pronunciationHint": "As a verb, usually stress LOAD.",
        "exampleSentence": "Upload one clear photo of your work.",
        "exampleJapanese": "課題の鮮明な写真を1枚アップロードしてください。",
        "commonMistake": "Do not confuse upload with download.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "technology"
      },
      "icon": "⬆️",
      "tags": [
        "technology",
        "level-24",
        "upload"
      ]
    },
    "after_fields": {
      "title_en": "upload",
      "title_ja": "アップロードする",
      "content": {
        "word": "upload",
        "japanese": "アップロードする",
        "kanaReading": "アップロウド",
        "pronunciationHint": "As a verb, usually stress LOAD.",
        "exampleSentence": "Upload one clear photo of your work.",
        "exampleJapanese": "課題の鮮明な写真を1枚アップロードしてください。",
        "commonMistake": "Do not confuse upload with download.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d0bc9024176f0c6b.svg",
          "kind": "sequence",
          "altEn": "A photo moves from a laptop to an online service.",
          "altJa": "写真をパソコンからオンラインへ送っています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "technology"
      },
      "icon": "",
      "tags": [
        "technology",
        "level-24",
        "upload"
      ]
    }
  },
  {
    "id": "word-l24-connect",
    "category": "words",
    "level": 24,
    "before_fields": {
      "title_en": "connect",
      "title_ja": "接続する・つながる",
      "content": {
        "word": "connect",
        "japanese": "接続する・つながる",
        "kanaReading": "コネクト",
        "pronunciationHint": "Stress NECT.",
        "exampleSentence": "Connect the headphones before the call.",
        "exampleJapanese": "通話前にヘッドホンを接続してください。",
        "commonMistake": "Use “connect to a network” and “connect a device to a network.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "technology"
      },
      "icon": "🔗",
      "tags": [
        "technology",
        "level-24",
        "connect"
      ]
    },
    "after_fields": {
      "title_en": "connect",
      "title_ja": "接続する・つながる",
      "content": {
        "word": "connect",
        "japanese": "接続する・つながる",
        "kanaReading": "コネクト",
        "pronunciationHint": "Stress NECT.",
        "exampleSentence": "Connect the headphones before the call.",
        "exampleJapanese": "通話前にヘッドホンを接続してください。",
        "commonMistake": "Use “connect to a network” and “connect a device to a network.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f57401c7f0c4ab73.svg",
          "kind": "scene",
          "altEn": "A cable is plugged into a laptop to connect the devices.",
          "altJa": "ケーブルをパソコンにつなぎ、機器を接続しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "technology"
      },
      "icon": "",
      "tags": [
        "technology",
        "level-24",
        "connect"
      ]
    }
  },
  {
    "id": "word-l25-recycle",
    "category": "words",
    "level": 25,
    "before_fields": {
      "title_en": "recycle",
      "title_ja": "リサイクルする",
      "content": {
        "word": "recycle",
        "japanese": "リサイクルする",
        "kanaReading": "リサイクル",
        "pronunciationHint": "Stress CY: re-CY-cle.",
        "exampleSentence": "We recycle glass at the community center.",
        "exampleJapanese": "地域センターでガラスをリサイクルします。",
        "commonMistake": "Not every material marked plastic is locally recyclable.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "environment"
      },
      "icon": "♻️",
      "tags": [
        "environment",
        "level-25",
        "recycle"
      ]
    },
    "after_fields": {
      "title_en": "recycle",
      "title_ja": "リサイクルする",
      "content": {
        "word": "recycle",
        "japanese": "リサイクルする",
        "kanaReading": "リサイクル",
        "pronunciationHint": "Stress CY: re-CY-cle.",
        "exampleSentence": "We recycle glass at the community center.",
        "exampleJapanese": "地域センターでガラスをリサイクルします。",
        "commonMistake": "Use “recycle paper” directly. “Recyclable” describes a material; “recycling” names the process.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-947a200a3d50f578.svg",
          "kind": "single",
          "altEn": "An illustration of recycle.",
          "altJa": "リサイクルするのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "environment"
      },
      "icon": "",
      "tags": [
        "environment",
        "level-25",
        "recycle"
      ]
    }
  },
  {
    "id": "word-l25-waste",
    "category": "words",
    "level": 25,
    "before_fields": {
      "title_en": "waste",
      "title_ja": "廃棄物・無駄にする",
      "content": {
        "word": "waste",
        "japanese": "廃棄物・無駄にする",
        "kanaReading": "ウェイスト",
        "pronunciationHint": "Use /eɪ/ and finish /st/.",
        "exampleSentence": "Plan meals carefully to reduce food waste.",
        "exampleJapanese": "食品ロスを減らすため、食事をよく計画しましょう。",
        "commonMistake": "“Waste” is usually uncountable when referring to rubbish broadly.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "environment"
      },
      "icon": "🗑️",
      "tags": [
        "environment",
        "level-25",
        "waste"
      ]
    },
    "after_fields": {
      "title_en": "waste",
      "title_ja": "廃棄物・無駄にする",
      "content": {
        "word": "waste",
        "japanese": "廃棄物・無駄にする",
        "kanaReading": "ウェイスト",
        "pronunciationHint": "Use /eɪ/ and finish /st/.",
        "exampleSentence": "Plan meals carefully to reduce food waste.",
        "exampleJapanese": "食品ロスを減らすため、食事をよく計画しましょう。",
        "commonMistake": "“Waste” is usually uncountable when referring to rubbish broadly.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d15e601e4340f650.svg",
          "kind": "single",
          "altEn": "An illustration of waste.",
          "altJa": "廃棄物・無駄にするのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "environment"
      },
      "icon": "",
      "tags": [
        "environment",
        "level-25",
        "waste"
      ]
    }
  },
  {
    "id": "word-l25-energy",
    "category": "words",
    "level": 25,
    "before_fields": {
      "title_en": "energy",
      "title_ja": "エネルギー",
      "content": {
        "word": "energy",
        "japanese": "エネルギー",
        "kanaReading": "エナジー",
        "pronunciationHint": "Stress EN; the g sounds /dʒ/.",
        "exampleSentence": "Turning off lights saves energy.",
        "exampleJapanese": "照明を消すとエネルギーを節約できます。",
        "commonMistake": "Do not pronounce the g as in “go.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "environment"
      },
      "icon": "⚡",
      "tags": [
        "environment",
        "level-25",
        "energy"
      ]
    },
    "after_fields": {
      "title_en": "energy",
      "title_ja": "エネルギー",
      "content": {
        "word": "energy",
        "japanese": "エネルギー",
        "kanaReading": "エナジー",
        "pronunciationHint": "Stress EN; the g sounds /dʒ/.",
        "exampleSentence": "Turning off lights saves energy.",
        "exampleJapanese": "照明を消すとエネルギーを節約できます。",
        "commonMistake": "Do not pronounce the g as in “go.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-de87f621133f9c96.svg",
          "kind": "scene",
          "altEn": "An energy meter shows electricity being used to light a bulb.",
          "altJa": "照明が電気を使い、使用量がメーターに表示されています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "environment"
      },
      "icon": "",
      "tags": [
        "environment",
        "level-25",
        "energy"
      ]
    }
  },
  {
    "id": "word-l25-pollution",
    "category": "words",
    "level": 25,
    "before_fields": {
      "title_en": "pollution",
      "title_ja": "汚染",
      "content": {
        "word": "pollution",
        "japanese": "汚染",
        "kanaReading": "ポルーション",
        "pronunciationHint": "Stress LU and pronounce tion /ʃən/.",
        "exampleSentence": "The city is working to reduce air pollution.",
        "exampleJapanese": "市は大気汚染の削減に取り組んでいます。",
        "commonMistake": "“Pollution” is uncountable; avoid “pollutions” in general use.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "environment"
      },
      "icon": "🏭",
      "tags": [
        "environment",
        "level-25",
        "pollution"
      ]
    },
    "after_fields": {
      "title_en": "pollution",
      "title_ja": "汚染",
      "content": {
        "word": "pollution",
        "japanese": "汚染",
        "kanaReading": "ポルーション",
        "pronunciationHint": "Stress LU and pronounce tion /ʃən/.",
        "exampleSentence": "The city is working to reduce air pollution.",
        "exampleJapanese": "市は大気汚染の削減に取り組んでいます。",
        "commonMistake": "“Pollution” is uncountable; avoid “pollutions” in general use.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7d2cf6bcb68a09bc.svg",
          "kind": "scene",
          "altEn": "Smoke from a chimney and exhaust from a car make the air dirty.",
          "altJa": "煙突と車から煙が出て、空気が汚れています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "environment"
      },
      "icon": "",
      "tags": [
        "environment",
        "level-25",
        "pollution"
      ]
    }
  },
  {
    "id": "word-l25-climate",
    "category": "words",
    "level": 25,
    "before_fields": {
      "title_en": "climate",
      "title_ja": "気候",
      "content": {
        "word": "climate",
        "japanese": "気候",
        "kanaReading": "クライメット",
        "pronunciationHint": "Stress CLI and use /aɪ/.",
        "exampleSentence": "This plant grows well in a warm climate.",
        "exampleJapanese": "この植物は暖かい気候でよく育ちます。",
        "commonMistake": "Weather is short-term; climate describes long-term patterns.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "environment"
      },
      "icon": "🌍",
      "tags": [
        "environment",
        "level-25",
        "climate"
      ]
    },
    "after_fields": {
      "title_en": "climate",
      "title_ja": "気候",
      "content": {
        "word": "climate",
        "japanese": "気候",
        "kanaReading": "クライメット",
        "pronunciationHint": "Stress CLI and use /aɪ/.",
        "exampleSentence": "This plant grows well in a warm climate.",
        "exampleJapanese": "この植物は暖かい気候でよく育ちます。",
        "commonMistake": "Weather is short-term; climate describes long-term patterns.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f3dd2c085ce70578.svg",
          "kind": "scene",
          "altEn": "A globe, many calendar years, and temperatures show weather patterns over a long time.",
          "altJa": "地球と長い年月、気温で長期的な気候を示しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "environment"
      },
      "icon": "",
      "tags": [
        "environment",
        "level-25",
        "climate"
      ]
    }
  },
  {
    "id": "word-l25-protect",
    "category": "words",
    "level": 25,
    "before_fields": {
      "title_en": "protect",
      "title_ja": "守る",
      "content": {
        "word": "protect",
        "japanese": "守る",
        "kanaReading": "プロテクト",
        "pronunciationHint": "Stress TECT.",
        "exampleSentence": "Trees protect the path from strong wind.",
        "exampleJapanese": "木々が強風から道を守っています。",
        "commonMistake": "Use “protect something from danger,” not “protect danger.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "environment"
      },
      "icon": "🛡️",
      "tags": [
        "environment",
        "level-25",
        "protect"
      ]
    },
    "after_fields": {
      "title_en": "protect",
      "title_ja": "守る",
      "content": {
        "word": "protect",
        "japanese": "守る",
        "kanaReading": "プロテクト",
        "pronunciationHint": "Stress TECT.",
        "exampleSentence": "Trees protect the path from strong wind.",
        "exampleJapanese": "木々が強風から道を守っています。",
        "commonMistake": "Use “protect something from danger,” not “protect danger.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-be511d4224bdf998.svg",
          "kind": "single",
          "altEn": "An illustration of protect.",
          "altJa": "守るのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "environment"
      },
      "icon": "",
      "tags": [
        "environment",
        "level-25",
        "protect"
      ]
    }
  },
  {
    "id": "word-l25-reduce",
    "category": "words",
    "level": 25,
    "before_fields": {
      "title_en": "reduce",
      "title_ja": "減らす",
      "content": {
        "word": "reduce",
        "japanese": "減らす",
        "kanaReading": "リデュース",
        "pronunciationHint": "Stress DUCE.",
        "exampleSentence": "We can reduce water use at home.",
        "exampleJapanese": "家庭で水の使用量を減らせます。",
        "commonMistake": "“Reduce” is transitive; say what becomes smaller.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "environment"
      },
      "icon": "📉",
      "tags": [
        "environment",
        "level-25",
        "reduce"
      ]
    },
    "after_fields": {
      "title_en": "reduce",
      "title_ja": "減らす",
      "content": {
        "word": "reduce",
        "japanese": "減らす",
        "kanaReading": "リデュース",
        "pronunciationHint": "Stress DUCE.",
        "exampleSentence": "We can reduce water use at home.",
        "exampleJapanese": "家庭で水の使用量を減らせます。",
        "commonMistake": "“Reduce water use” names what you make smaller. “Reduce by ten percent” gives the amount of the change.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-8e778eaa0fc310ec.svg",
          "kind": "contrast",
          "altEn": "Less water is used after a change in daily habits.",
          "altJa": "習慣を変えた後、水の使用量が少なくなっています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "environment"
      },
      "icon": "",
      "tags": [
        "environment",
        "level-25",
        "reduce"
      ]
    }
  },
  {
    "id": "word-l25-reuse",
    "category": "words",
    "level": 25,
    "before_fields": {
      "title_en": "reuse",
      "title_ja": "再利用する",
      "content": {
        "word": "reuse",
        "japanese": "再利用する",
        "kanaReading": "リユーズ",
        "pronunciationHint": "Stress USE and finish with voiced /z/.",
        "exampleSentence": "Reuse the jar to store pencils.",
        "exampleJapanese": "その瓶を鉛筆入れとして再利用してください。",
        "commonMistake": "The noun “reuse” may have /s/ at the end; the verb has /z/.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "environment"
      },
      "icon": "🫙",
      "tags": [
        "environment",
        "level-25",
        "reuse"
      ]
    },
    "after_fields": {
      "title_en": "reuse",
      "title_ja": "再利用する",
      "content": {
        "word": "reuse",
        "japanese": "再利用する",
        "kanaReading": "リユーズ",
        "pronunciationHint": "Stress USE and finish with voiced /z/.",
        "exampleSentence": "Reuse the jar to store pencils.",
        "exampleJapanese": "その瓶を鉛筆入れとして再利用してください。",
        "commonMistake": "The noun “reuse” may have /s/ at the end; the verb has /z/.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-879485145da6a330.svg",
          "kind": "sequence",
          "altEn": "An empty food jar becomes a useful pencil holder.",
          "altJa": "空き瓶を捨てずに鉛筆入れとして使い直しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "environment"
      },
      "icon": "",
      "tags": [
        "environment",
        "level-25",
        "reuse"
      ]
    }
  },
  {
    "id": "word-l25-resource",
    "category": "words",
    "level": 25,
    "before_fields": {
      "title_en": "resource",
      "title_ja": "資源・資料",
      "content": {
        "word": "resource",
        "japanese": "資源・資料",
        "kanaReading": "リソース",
        "pronunciationHint": "Stress RE in US English; UK stress may differ.",
        "exampleSentence": "Clean water is a precious resource.",
        "exampleJapanese": "きれいな水は貴重な資源です。",
        "commonMistake": "Use plural “resources” for several materials or sources.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "environment"
      },
      "icon": "💧",
      "tags": [
        "environment",
        "level-25",
        "resource"
      ]
    },
    "after_fields": {
      "title_en": "resource",
      "title_ja": "資源・資料",
      "content": {
        "word": "resource",
        "japanese": "資源・資料",
        "kanaReading": "リソース",
        "pronunciationHint": "Stress differs across speakers and varieties. Listen for the stressed syllable in your selected US or UK model.",
        "exampleSentence": "Clean water is a precious resource.",
        "exampleJapanese": "きれいな水は貴重な資源です。",
        "commonMistake": "Use plural “resources” for several materials or sources.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-586012e2c6361416.svg",
          "kind": "scene",
          "altEn": "Water, trees, and sunlight are resources people can use.",
          "altJa": "水・木・日光という、人が利用できる資源。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "environment"
      },
      "icon": "",
      "tags": [
        "environment",
        "level-25",
        "resource"
      ]
    }
  },
  {
    "id": "word-l25-sustainable",
    "category": "words",
    "level": 25,
    "before_fields": {
      "title_en": "sustainable",
      "title_ja": "持続可能な",
      "content": {
        "word": "sustainable",
        "japanese": "持続可能な",
        "kanaReading": "サステイナブル",
        "pronunciationHint": "Stress STAIN; later syllables are light.",
        "exampleSentence": "The café uses sustainable packaging.",
        "exampleJapanese": "そのカフェは持続可能な包装を使っています。",
        "commonMistake": "Do not use “sustainable” merely to mean popular or modern.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "environment"
      },
      "icon": "🌱",
      "tags": [
        "environment",
        "level-25",
        "sustainable"
      ]
    },
    "after_fields": {
      "title_en": "sustainable",
      "title_ja": "持続可能な",
      "content": {
        "word": "sustainable",
        "japanese": "持続可能な",
        "kanaReading": "サステイナブル",
        "pronunciationHint": "Stress STAIN; later syllables are light.",
        "exampleSentence": "The café uses sustainable packaging.",
        "exampleJapanese": "そのカフェは持続可能な包装を使っています。",
        "commonMistake": "Do not use “sustainable” merely to mean popular or modern.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-096a6aa5f5c90e6f.svg",
          "kind": "sequence",
          "altEn": "New trees are planted and grow so a resource can continue into the future.",
          "altJa": "木を植えて育て、将来も資源を使えるようにしています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "environment"
      },
      "icon": "",
      "tags": [
        "environment",
        "level-25",
        "sustainable"
      ]
    }
  },
  {
    "id": "word-l26-confident",
    "category": "words",
    "level": 26,
    "before_fields": {
      "title_en": "confident",
      "title_ja": "自信がある",
      "content": {
        "word": "confident",
        "japanese": "自信がある",
        "kanaReading": "コンフィデント",
        "pronunciationHint": "Stress CON; later vowels are weak.",
        "exampleSentence": "I feel more confident after practicing.",
        "exampleJapanese": "練習した後はもっと自信が持てます。",
        "commonMistake": "Say “confident about something” or “confident that…”.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "nuanced-emotions"
      },
      "icon": "😌",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "confident"
      ]
    },
    "after_fields": {
      "title_en": "confident",
      "title_ja": "自信がある",
      "content": {
        "word": "confident",
        "japanese": "自信がある",
        "kanaReading": "コンフィデント",
        "pronunciationHint": "Stress CON; later vowels are weak.",
        "exampleSentence": "I feel more confident after practicing.",
        "exampleJapanese": "練習した後はもっと自信が持てます。",
        "commonMistake": "Say “confident about something” or “confident that…”.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-e473562a551f2349.svg",
          "kind": "scene",
          "altEn": "A prepared speaker stands ready to present without hesitation.",
          "altJa": "準備した話し手が、自信を持って発表しようとしています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "nuanced-emotions"
      },
      "icon": "",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "confident"
      ]
    }
  },
  {
    "id": "word-l26-nervous",
    "category": "words",
    "level": 26,
    "before_fields": {
      "title_en": "nervous",
      "title_ja": "緊張している",
      "content": {
        "word": "nervous",
        "japanese": "緊張している",
        "kanaReading": "ナーヴァス",
        "pronunciationHint": "Stress NER; the second vowel is weak.",
        "exampleSentence": "She felt nervous before her presentation.",
        "exampleJapanese": "彼女は発表前に緊張していました。",
        "commonMistake": "“Nervous” describes anxiety; “sensitive” has a different meaning.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "nuanced-emotions"
      },
      "icon": "😬",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "nervous"
      ]
    },
    "after_fields": {
      "title_en": "nervous",
      "title_ja": "緊張している",
      "content": {
        "word": "nervous",
        "japanese": "緊張している",
        "kanaReading": "ナーヴァス",
        "pronunciationHint": "Stress NER; the second vowel is weak.",
        "exampleSentence": "She felt nervous before her presentation.",
        "exampleJapanese": "彼女は発表前に緊張していました。",
        "commonMistake": "“Nervous” describes anxiety; “sensitive” has a different meaning.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7319daaa3abcdb03.svg",
          "kind": "scene",
          "altEn": "A worried person is about to speak into a microphone.",
          "altJa": "マイクの前で、これから話すことに緊張している人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "nuanced-emotions"
      },
      "icon": "",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "nervous"
      ]
    }
  },
  {
    "id": "word-l26-proud",
    "category": "words",
    "level": 26,
    "before_fields": {
      "title_en": "proud",
      "title_ja": "誇りに思う",
      "content": {
        "word": "proud",
        "japanese": "誇りに思う",
        "kanaReading": "プラウド",
        "pronunciationHint": "Blend /pr/ and glide through /aʊ/.",
        "exampleSentence": "I am proud of your steady progress.",
        "exampleJapanese": "あなたの着実な進歩を誇りに思います。",
        "commonMistake": "Say “proud of,” not “proud for.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "nuanced-emotions"
      },
      "icon": "🏅",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "proud"
      ]
    },
    "after_fields": {
      "title_en": "proud",
      "title_ja": "誇りに思う",
      "content": {
        "word": "proud",
        "japanese": "誇りに思う",
        "kanaReading": "プラウド",
        "pronunciationHint": "Blend /pr/ and glide through /aʊ/.",
        "exampleSentence": "I am proud of your steady progress.",
        "exampleJapanese": "あなたの着実な進歩を誇りに思います。",
        "commonMistake": "Say “proud of,” not “proud for.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-eb0216d59ed0a2e0.svg",
          "kind": "scene",
          "altEn": "A person happily holds a certificate they worked to earn.",
          "altJa": "努力して得た賞状を持ち、誇らしく感じている人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "nuanced-emotions"
      },
      "icon": "",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "proud"
      ]
    }
  },
  {
    "id": "word-l26-disappointed",
    "category": "words",
    "level": 26,
    "before_fields": {
      "title_en": "disappointed",
      "title_ja": "がっかりした",
      "content": {
        "word": "disappointed",
        "japanese": "がっかりした",
        "kanaReading": "ディサポインティッド",
        "pronunciationHint": "Stress POINT.",
        "exampleSentence": "We were disappointed by the cancellation.",
        "exampleJapanese": "私たちは中止にがっかりしました。",
        "commonMistake": "Use “disappointed” for a person and “disappointing” for a result.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "nuanced-emotions"
      },
      "icon": "😞",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "disappointed"
      ]
    },
    "after_fields": {
      "title_en": "disappointed",
      "title_ja": "がっかりした",
      "content": {
        "word": "disappointed",
        "japanese": "がっかりした",
        "kanaReading": "ディサポインティッド",
        "pronunciationHint": "Stress POINT.",
        "exampleSentence": "We were disappointed by the cancellation.",
        "exampleJapanese": "私たちは中止にがっかりしました。",
        "commonMistake": "Use “disappointed” for a person and “disappointing” for a result.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c1b8c4483e208822.svg",
          "kind": "scene",
          "altEn": "A person hoped to win a medal but is sad when it does not happen.",
          "altJa": "メダルを期待していたのに得られず、がっかりしている人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "nuanced-emotions"
      },
      "icon": "",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "disappointed"
      ]
    }
  },
  {
    "id": "word-l26-grateful",
    "category": "words",
    "level": 26,
    "before_fields": {
      "title_en": "grateful",
      "title_ja": "感謝している",
      "content": {
        "word": "grateful",
        "japanese": "感謝している",
        "kanaReading": "グレイトフル",
        "pronunciationHint": "Blend /gr/ and use /eɪ/.",
        "exampleSentence": "I am grateful for your honest feedback.",
        "exampleJapanese": "率直なフィードバックに感謝しています。",
        "commonMistake": "Say “grateful for something” and “grateful to someone.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "nuanced-emotions"
      },
      "icon": "🙏",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "grateful"
      ]
    },
    "after_fields": {
      "title_en": "grateful",
      "title_ja": "感謝している",
      "content": {
        "word": "grateful",
        "japanese": "感謝している",
        "kanaReading": "グレイトフル",
        "pronunciationHint": "Blend /gr/ and use /eɪ/.",
        "exampleSentence": "I am grateful for your honest feedback.",
        "exampleJapanese": "率直なフィードバックに感謝しています。",
        "commonMistake": "Say “grateful for something” and “grateful to someone.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-e5acca960cef2876.svg",
          "kind": "scene",
          "altEn": "Someone receives help and smiles warmly at the helper.",
          "altJa": "助けてもらった人が相手に感謝してほほえんでいます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "nuanced-emotions"
      },
      "icon": "",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "grateful"
      ]
    }
  },
  {
    "id": "word-l26-curious",
    "category": "words",
    "level": 26,
    "before_fields": {
      "title_en": "curious",
      "title_ja": "好奇心がある",
      "content": {
        "word": "curious",
        "japanese": "好奇心がある",
        "kanaReading": "キュリアス",
        "pronunciationHint": "Stress CURE; the ending is light.",
        "exampleSentence": "The children were curious about the new machine.",
        "exampleJapanese": "子どもたちは新しい機械に興味津々でした。",
        "commonMistake": "“Curious” can mean interested or unusual, depending on context.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "nuanced-emotions"
      },
      "icon": "🧐",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "curious"
      ]
    },
    "after_fields": {
      "title_en": "curious",
      "title_ja": "好奇心がある",
      "content": {
        "word": "curious",
        "japanese": "好奇心がある",
        "kanaReading": "キュリアス",
        "pronunciationHint": "Stress CURE; the ending is light.",
        "exampleSentence": "The children were curious about the new machine.",
        "exampleJapanese": "子どもたちは新しい機械に興味津々でした。",
        "commonMistake": "“Curious” can mean interested or unusual, depending on context.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-0991017bf350be58.svg",
          "kind": "scene",
          "altEn": "A person leans in to examine an unfamiliar puzzle piece.",
          "altJa": "知らないパズルのピースを興味深く観察している人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "nuanced-emotions"
      },
      "icon": "",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "curious"
      ]
    }
  },
  {
    "id": "word-l26-embarrassed",
    "category": "words",
    "level": 26,
    "before_fields": {
      "title_en": "embarrassed",
      "title_ja": "恥ずかしい・気まずい",
      "content": {
        "word": "embarrassed",
        "japanese": "恥ずかしい・気まずい",
        "kanaReading": "エンバラスト",
        "pronunciationHint": "Stress BAR and finish with t.",
        "exampleSentence": "I felt embarrassed when I forgot her name.",
        "exampleJapanese": "彼女の名前を忘れて恥ずかしく感じました。",
        "commonMistake": "Use “embarrassed” for a person and “embarrassing” for the situation.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "nuanced-emotions"
      },
      "icon": "😳",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "embarrassed"
      ]
    },
    "after_fields": {
      "title_en": "embarrassed",
      "title_ja": "恥ずかしい・気まずい",
      "content": {
        "word": "embarrassed",
        "japanese": "恥ずかしい・気まずい",
        "kanaReading": "エンバラスト",
        "pronunciationHint": "Stress BAR and finish with t.",
        "exampleSentence": "I felt embarrassed when I forgot her name.",
        "exampleJapanese": "彼女の名前を忘れて恥ずかしく感じました。",
        "commonMistake": "Use “embarrassed” for a person and “embarrassing” for the situation.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7d24eb08e2d63c93.svg",
          "kind": "scene",
          "altEn": "A person blushes after accidentally spilling a drink in front of others.",
          "altJa": "人前で飲み物をこぼし、頬を赤くして気まずそうな人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "nuanced-emotions"
      },
      "icon": "",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "embarrassed"
      ]
    }
  },
  {
    "id": "word-l26-relieved",
    "category": "words",
    "level": 26,
    "before_fields": {
      "title_en": "relieved",
      "title_ja": "ほっとした",
      "content": {
        "word": "relieved",
        "japanese": "ほっとした",
        "kanaReading": "リリーヴド",
        "pronunciationHint": "Stress LIEVED and keep the final d.",
        "exampleSentence": "We were relieved to hear the good news.",
        "exampleJapanese": "良い知らせを聞いてほっとしました。",
        "commonMistake": "Say “relieved to know” or “relieved that…,” not “relieved about” in every case.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "nuanced-emotions"
      },
      "icon": "😮‍💨",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "relieved"
      ]
    },
    "after_fields": {
      "title_en": "relieved",
      "title_ja": "ほっとした",
      "content": {
        "word": "relieved",
        "japanese": "ほっとした",
        "kanaReading": "リリーヴド",
        "pronunciationHint": "Stress LIEVED and keep the final d.",
        "exampleSentence": "We were relieved to hear the good news.",
        "exampleJapanese": "良い知らせを聞いてほっとしました。",
        "commonMistake": "Use “relieved to hear the news” or “relieved that everyone is safe.” “Relieved about” also works with an appropriate noun.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-1ffc5657c84d1b94.svg",
          "kind": "sequence",
          "altEn": "Worry about something missing changes to calm after it is found.",
          "altJa": "なくし物を心配していた人が、見つけてほっとします。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "nuanced-emotions"
      },
      "icon": "",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "relieved"
      ]
    }
  },
  {
    "id": "word-l26-frustrated",
    "category": "words",
    "level": 26,
    "before_fields": {
      "title_en": "frustrated",
      "title_ja": "いら立った・もどかしい",
      "content": {
        "word": "frustrated",
        "japanese": "いら立った・もどかしい",
        "kanaReading": "フラストレイティッド",
        "pronunciationHint": "Stress FRUS.",
        "exampleSentence": "He was frustrated with the slow connection.",
        "exampleJapanese": "彼は接続の遅さにいら立っていました。",
        "commonMistake": "Use “frustrated” for a person and “frustrating” for a cause.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "nuanced-emotions"
      },
      "icon": "😣",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "frustrated"
      ]
    },
    "after_fields": {
      "title_en": "frustrated",
      "title_ja": "いら立った・もどかしい",
      "content": {
        "word": "frustrated",
        "japanese": "いら立った・もどかしい",
        "kanaReading": "フラストレイティッド",
        "pronunciationHint": "Stress FRUS.",
        "exampleSentence": "He was frustrated with the slow connection.",
        "exampleJapanese": "彼は接続の遅さにいら立っていました。",
        "commonMistake": "Use “frustrated” for a person and “frustrating” for a cause.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-27cbf61198f35d82.svg",
          "kind": "scene",
          "altEn": "A person is annoyed because a slow computer will not finish a task.",
          "altJa": "パソコンが遅く作業が進まないため、もどかしく感じている人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "nuanced-emotions"
      },
      "icon": "",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "frustrated"
      ]
    }
  },
  {
    "id": "word-l26-calm",
    "category": "words",
    "level": 26,
    "before_fields": {
      "title_en": "calm",
      "title_ja": "落ち着いた",
      "content": {
        "word": "calm",
        "japanese": "落ち着いた",
        "kanaReading": "カーム",
        "pronunciationHint": "The l is silent; hold the vowel.",
        "exampleSentence": "Take a breath and stay calm.",
        "exampleJapanese": "深呼吸して落ち着いてください。",
        "commonMistake": "Do not pronounce the written l.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "nuanced-emotions"
      },
      "icon": "🧘",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "calm"
      ]
    },
    "after_fields": {
      "title_en": "calm",
      "title_ja": "落ち着いた",
      "content": {
        "word": "calm",
        "japanese": "落ち着いた",
        "kanaReading": "カーム",
        "pronunciationHint": "A pronunciation without /l/ is common in both models. Some speakers pronounce a light /l/.",
        "exampleSentence": "Take a breath and stay calm.",
        "exampleJapanese": "深呼吸して落ち着いてください。",
        "commonMistake": "“Stay calm” describes your state. Use “calmly” with an action: “speak calmly.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d95007a24079611d.svg",
          "kind": "single",
          "altEn": "An illustration of calm.",
          "altJa": "落ち着いたのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "nuanced-emotions"
      },
      "icon": "",
      "tags": [
        "nuanced-emotions",
        "level-26",
        "calm"
      ]
    }
  },
  {
    "id": "word-l27-compare",
    "category": "words",
    "level": 27,
    "before_fields": {
      "title_en": "compare",
      "title_ja": "比較する",
      "content": {
        "word": "compare",
        "japanese": "比較する",
        "kanaReading": "コンペア",
        "pronunciationHint": "Stress PARE.",
        "exampleSentence": "Compare the two solutions before choosing.",
        "exampleJapanese": "選ぶ前に2つの解決策を比較してください。",
        "commonMistake": "Compare A with B to examine differences; “compare to” often notes similarity.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "critical-thinking"
      },
      "icon": "⚖️",
      "tags": [
        "critical-thinking",
        "level-27",
        "compare"
      ]
    },
    "after_fields": {
      "title_en": "compare",
      "title_ja": "比較する",
      "content": {
        "word": "compare",
        "japanese": "比較する",
        "kanaReading": "コンペア",
        "pronunciationHint": "Stress PARE.",
        "exampleSentence": "Compare the two solutions before choosing.",
        "exampleJapanese": "選ぶ前に2つの解決策を比較してください。",
        "commonMistake": "“Compare A with B” and “compare A to B” can both introduce a comparison; explain which similarities or differences you mean.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-8dce0e555463d1df.svg",
          "kind": "contrast",
          "altEn": "Two apples are placed side by side to examine size and colour.",
          "altJa": "二つのりんごを並べ、大きさや色を比べています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "critical-thinking"
      },
      "icon": "",
      "tags": [
        "critical-thinking",
        "level-27",
        "compare"
      ]
    }
  },
  {
    "id": "word-l27-contrast",
    "category": "words",
    "level": 27,
    "before_fields": {
      "title_en": "contrast",
      "title_ja": "対比する・対照",
      "content": {
        "word": "contrast",
        "japanese": "対比する・対照",
        "kanaReading": "コントラスト",
        "pronunciationHint": "As a verb, stress TRAST; noun stress often begins earlier.",
        "exampleSentence": "Contrast the writer’s two main ideas.",
        "exampleJapanese": "筆者の2つの主な考えを対比してください。",
        "commonMistake": "Do not use “contrast” when only listing similarities.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "critical-thinking"
      },
      "icon": "◐",
      "tags": [
        "critical-thinking",
        "level-27",
        "contrast"
      ]
    },
    "after_fields": {
      "title_en": "contrast",
      "title_ja": "対比する・対照",
      "content": {
        "word": "contrast",
        "japanese": "対比する・対照",
        "kanaReading": "コントラスト",
        "pronunciationHint": "As a verb, stress TRAST. The noun usually stresses CON.",
        "exampleSentence": "Contrast the writer’s two main ideas.",
        "exampleJapanese": "筆者の2つの主な考えを対比してください。",
        "commonMistake": "Do not use “contrast” when only listing similarities.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-214ddc612995b27a.svg",
          "kind": "contrast",
          "altEn": "A bright sunny day and a rainy day highlight a clear difference.",
          "altJa": "晴れた日と雨の日を並べ、違いをはっきり示しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "critical-thinking"
      },
      "icon": "",
      "tags": [
        "critical-thinking",
        "level-27",
        "contrast"
      ]
    }
  },
  {
    "id": "word-l27-describe",
    "category": "words",
    "level": 27,
    "before_fields": {
      "title_en": "describe",
      "title_ja": "説明する・描写する",
      "content": {
        "word": "describe",
        "japanese": "説明する・描写する",
        "kanaReading": "ディスクライブ",
        "pronunciationHint": "Stress SCRIBE.",
        "exampleSentence": "Describe what changed in the picture.",
        "exampleJapanese": "絵の中で何が変わったか説明してください。",
        "commonMistake": "Describe something directly; do not add “about.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "critical-thinking"
      },
      "icon": "🖼️",
      "tags": [
        "critical-thinking",
        "level-27",
        "describe"
      ]
    },
    "after_fields": {
      "title_en": "describe",
      "title_ja": "説明する・描写する",
      "content": {
        "word": "describe",
        "japanese": "説明する・描写する",
        "kanaReading": "ディスクライブ",
        "pronunciationHint": "Stress SCRIBE.",
        "exampleSentence": "Describe what changed in the picture.",
        "exampleJapanese": "絵の中で何が変わったか説明してください。",
        "commonMistake": "Describe something directly; do not add “about.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4642cbbd8bea81e3.svg",
          "kind": "scene",
          "altEn": "A speaker points to an apple and describes its visible features.",
          "altJa": "りんごを指し、見た目の特徴を説明する人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "critical-thinking"
      },
      "icon": "",
      "tags": [
        "critical-thinking",
        "level-27",
        "describe"
      ]
    }
  },
  {
    "id": "word-l27-summarize",
    "category": "words",
    "level": 27,
    "before_fields": {
      "title_en": "summarize",
      "title_ja": "要約する",
      "content": {
        "word": "summarize",
        "japanese": "要約する",
        "kanaReading": "サマライズ",
        "pronunciationHint": "Stress SUM and finish with voiced /z/.",
        "exampleSentence": "Summarize the article in three sentences.",
        "exampleJapanese": "記事を3文で要約してください。",
        "commonMistake": "A summary keeps key ideas, not every detail.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "critical-thinking"
      },
      "icon": "📝",
      "tags": [
        "critical-thinking",
        "level-27",
        "summarize"
      ]
    },
    "after_fields": {
      "title_en": "summarize",
      "title_ja": "要約する",
      "content": {
        "word": "summarize",
        "japanese": "要約する",
        "kanaReading": "サマライズ",
        "pronunciationHint": "Stress SUM and finish with voiced /z/.",
        "exampleSentence": "Summarize the article in three sentences.",
        "exampleJapanese": "記事を3文で要約してください。",
        "commonMistake": "A summary keeps key ideas, not every detail.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b8942ff9379b9450.svg",
          "kind": "sequence",
          "altEn": "A long page is condensed to three short key points.",
          "altJa": "長い文章を、三つの短い要点にまとめています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "critical-thinking"
      },
      "icon": "",
      "tags": [
        "critical-thinking",
        "level-27",
        "summarize"
      ]
    }
  },
  {
    "id": "word-l27-analyze",
    "category": "words",
    "level": 27,
    "before_fields": {
      "title_en": "analyze",
      "title_ja": "分析する",
      "content": {
        "word": "analyze",
        "japanese": "分析する",
        "kanaReading": "アナライズ",
        "pronunciationHint": "Stress AN and finish with voiced /z/.",
        "exampleSentence": "Analyze why the plan succeeded.",
        "exampleJapanese": "計画が成功した理由を分析してください。",
        "commonMistake": "Do not use “analyze about”; analyze takes a direct object.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "critical-thinking"
      },
      "icon": "🔍",
      "tags": [
        "critical-thinking",
        "level-27",
        "analyze"
      ]
    },
    "after_fields": {
      "title_en": "analyze",
      "title_ja": "分析する",
      "content": {
        "word": "analyze",
        "japanese": "分析する",
        "kanaReading": "アナライズ",
        "pronunciationHint": "Stress AN and finish with voiced /z/.",
        "exampleSentence": "Analyze why the plan succeeded.",
        "exampleJapanese": "計画が成功した理由を分析してください。",
        "commonMistake": "Do not use “analyze about”; analyze takes a direct object.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-60ac28881db17df7.svg",
          "kind": "scene",
          "altEn": "A person examines parts of a chart to understand the pattern behind it.",
          "altJa": "グラフを部分ごとに調べ、傾向の理由を考えている人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "critical-thinking"
      },
      "icon": "",
      "tags": [
        "critical-thinking",
        "level-27",
        "analyze"
      ]
    }
  },
  {
    "id": "word-l27-evidence",
    "category": "words",
    "level": 27,
    "before_fields": {
      "title_en": "evidence",
      "title_ja": "証拠・根拠",
      "content": {
        "word": "evidence",
        "japanese": "証拠・根拠",
        "kanaReading": "エヴィデンス",
        "pronunciationHint": "Stress EV; the later vowels are weak.",
        "exampleSentence": "The chart provides evidence for her claim.",
        "exampleJapanese": "その図は彼女の主張の根拠になります。",
        "commonMistake": "“Evidence” is uncountable; say “a piece of evidence.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "critical-thinking"
      },
      "icon": "🔎",
      "tags": [
        "critical-thinking",
        "level-27",
        "evidence"
      ]
    },
    "after_fields": {
      "title_en": "evidence",
      "title_ja": "証拠・根拠",
      "content": {
        "word": "evidence",
        "japanese": "証拠・根拠",
        "kanaReading": "エヴィデンス",
        "pronunciationHint": "Stress EV; the later vowels are weak.",
        "exampleSentence": "The chart provides evidence for her claim.",
        "exampleJapanese": "その図は彼女の主張の根拠になります。",
        "commonMistake": "“Evidence” is uncountable; say “a piece of evidence.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-326790fbb2eb9969.svg",
          "kind": "scene",
          "altEn": "A photograph of a footprint provides evidence of what happened.",
          "altJa": "足跡の写真が、何が起きたかを示す証拠になっています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "critical-thinking"
      },
      "icon": "",
      "tags": [
        "critical-thinking",
        "level-27",
        "evidence"
      ]
    }
  },
  {
    "id": "word-l27-reason",
    "category": "words",
    "level": 27,
    "before_fields": {
      "title_en": "reason",
      "title_ja": "理由・推論する",
      "content": {
        "word": "reason",
        "japanese": "理由・推論する",
        "kanaReading": "リーズン",
        "pronunciationHint": "The s sounds /z/.",
        "exampleSentence": "Give one reason for your choice.",
        "exampleJapanese": "選んだ理由を1つ挙げてください。",
        "commonMistake": "Use “the reason for a decision” or “the reason why…”.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "critical-thinking"
      },
      "icon": "🧠",
      "tags": [
        "critical-thinking",
        "level-27",
        "reason"
      ]
    },
    "after_fields": {
      "title_en": "reason",
      "title_ja": "理由・推論する",
      "content": {
        "word": "reason",
        "japanese": "理由・推論する",
        "kanaReading": "リーズン",
        "pronunciationHint": "The s sounds /z/.",
        "exampleSentence": "Give one reason for your choice.",
        "exampleJapanese": "選んだ理由を1つ挙げてください。",
        "commonMistake": "Use “the reason for a decision” or “the reason why…”.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-9753fbd7f5fa58c6.svg",
          "kind": "sequence",
          "altEn": "Rain explains why a person takes an umbrella.",
          "altJa": "雨が降っていることが、傘を持つ理由になっています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "critical-thinking"
      },
      "icon": "",
      "tags": [
        "critical-thinking",
        "level-27",
        "reason"
      ]
    }
  },
  {
    "id": "word-l27-result",
    "category": "words",
    "level": 27,
    "before_fields": {
      "title_en": "result",
      "title_ja": "結果・結果として生じる",
      "content": {
        "word": "result",
        "japanese": "結果・結果として生じる",
        "kanaReading": "リザルト",
        "pronunciationHint": "Stress ZULT.",
        "exampleSentence": "The result matched our prediction.",
        "exampleJapanese": "結果は私たちの予想と一致しました。",
        "commonMistake": "Use “result of” for a cause and “result in” for an outcome.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "critical-thinking"
      },
      "icon": "📊",
      "tags": [
        "critical-thinking",
        "level-27",
        "result"
      ]
    },
    "after_fields": {
      "title_en": "result",
      "title_ja": "結果・結果として生じる",
      "content": {
        "word": "result",
        "japanese": "結果・結果として生じる",
        "kanaReading": "リザルト",
        "pronunciationHint": "Stress ZULT.",
        "exampleSentence": "The result matched our prediction.",
        "exampleJapanese": "結果は私たちの予想と一致しました。",
        "commonMistake": "Use “result of” for a cause and “result in” for an outcome.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b793c64cfb3b7b43.svg",
          "kind": "sequence",
          "altEn": "A planted seed grows into a plant, showing the result of the action.",
          "altJa": "種を植えた結果、植物が育っています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "critical-thinking"
      },
      "icon": "",
      "tags": [
        "critical-thinking",
        "level-27",
        "result"
      ]
    }
  },
  {
    "id": "word-l27-method",
    "category": "words",
    "level": 27,
    "before_fields": {
      "title_en": "method",
      "title_ja": "方法",
      "content": {
        "word": "method",
        "japanese": "方法",
        "kanaReading": "メソッド",
        "pronunciationHint": "Use the voiceless th /θ/, as in “think.”",
        "exampleSentence": "This method works well for short texts.",
        "exampleJapanese": "この方法は短い文章に効果的です。",
        "commonMistake": "Do not voice the th as /ð/ or replace it with d or z.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "critical-thinking"
      },
      "icon": "🧪",
      "tags": [
        "critical-thinking",
        "level-27",
        "method"
      ]
    },
    "after_fields": {
      "title_en": "method",
      "title_ja": "方法",
      "content": {
        "word": "method",
        "japanese": "方法",
        "kanaReading": "メソッド",
        "pronunciationHint": "Use the voiceless th /θ/, as in “think.”",
        "exampleSentence": "This method works well for short texts.",
        "exampleJapanese": "この方法は短い文章に効果的です。",
        "commonMistake": "Do not voice the th as /ð/ or replace it with d or z.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-39d0c7b63fa8bdb9.svg",
          "kind": "sequence",
          "altEn": "A numbered method shows how to fold a shirt.",
          "altJa": "シャツをたたむ方法を番号付きの手順で示しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "critical-thinking"
      },
      "icon": "",
      "tags": [
        "critical-thinking",
        "level-27",
        "method"
      ]
    }
  },
  {
    "id": "word-l27-opinion",
    "category": "words",
    "level": 27,
    "before_fields": {
      "title_en": "opinion",
      "title_ja": "意見",
      "content": {
        "word": "opinion",
        "japanese": "意見",
        "kanaReading": "オピニオン",
        "pronunciationHint": "Stress PIN.",
        "exampleSentence": "In my opinion, the second option is clearer.",
        "exampleJapanese": "私の意見では、2つ目の案のほうが明確です。",
        "commonMistake": "Say “in my opinion,” not “according to my opinion.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "critical-thinking"
      },
      "icon": "💭",
      "tags": [
        "critical-thinking",
        "level-27",
        "opinion"
      ]
    },
    "after_fields": {
      "title_en": "opinion",
      "title_ja": "意見",
      "content": {
        "word": "opinion",
        "japanese": "意見",
        "kanaReading": "オピニオン",
        "pronunciationHint": "Stress PIN.",
        "exampleSentence": "In my opinion, the second option is clearer.",
        "exampleJapanese": "私の意見では、2つ目の案のほうが明確です。",
        "commonMistake": "Say “in my opinion,” not “according to my opinion.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-8ee239a337570ffa.svg",
          "kind": "scene",
          "altEn": "Different people think different fruits are best.",
          "altJa": "人によって、どちらの果物がよいか考えが違います。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "critical-thinking"
      },
      "icon": "",
      "tags": [
        "critical-thinking",
        "level-27",
        "opinion"
      ]
    }
  },
  {
    "id": "word-l28-proposal",
    "category": "words",
    "level": 28,
    "before_fields": {
      "title_en": "proposal",
      "title_ja": "提案書・提案",
      "content": {
        "word": "proposal",
        "japanese": "提案書・提案",
        "kanaReading": "プロポウザル",
        "pronunciationHint": "Stress PO: pro-PO-sal.",
        "exampleSentence": "The team discussed my proposal.",
        "exampleJapanese": "チームは私の提案について話し合いました。",
        "commonMistake": "A proposal is a developed suggestion, not merely an idea.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "business-and-projects"
      },
      "icon": "📑",
      "tags": [
        "business-and-projects",
        "level-28",
        "proposal"
      ]
    },
    "after_fields": {
      "title_en": "proposal",
      "title_ja": "提案書・提案",
      "content": {
        "word": "proposal",
        "japanese": "提案書・提案",
        "kanaReading": "プロポウザル",
        "pronunciationHint": "Stress PO: pro-PO-sal.",
        "exampleSentence": "The team discussed my proposal.",
        "exampleJapanese": "チームは私の提案について話し合いました。",
        "commonMistake": "A proposal is a developed suggestion, not merely an idea.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-488626c709a0b9af.svg",
          "kind": "scene",
          "altEn": "One person presents a written plan for a group to consider.",
          "altJa": "一人が案を書いた紙を示し、グループに提案しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "business-and-projects"
      },
      "icon": "",
      "tags": [
        "business-and-projects",
        "level-28",
        "proposal"
      ]
    }
  },
  {
    "id": "word-l28-budget",
    "category": "words",
    "level": 28,
    "before_fields": {
      "title_en": "budget",
      "title_ja": "予算",
      "content": {
        "word": "budget",
        "japanese": "予算",
        "kanaReading": "バジェット",
        "pronunciationHint": "Stress BUD; g sounds /dʒ/.",
        "exampleSentence": "The project stayed within budget.",
        "exampleJapanese": "そのプロジェクトは予算内に収まりました。",
        "commonMistake": "Say “within budget” or “over budget,” not “inside the budget.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "business-and-projects"
      },
      "icon": "💹",
      "tags": [
        "business-and-projects",
        "level-28",
        "budget"
      ]
    },
    "after_fields": {
      "title_en": "budget",
      "title_ja": "予算",
      "content": {
        "word": "budget",
        "japanese": "予算",
        "kanaReading": "バジェット",
        "pronunciationHint": "Stress BUD; g sounds /dʒ/.",
        "exampleSentence": "The project stayed within budget.",
        "exampleJapanese": "そのプロジェクトは予算内に収まりました。",
        "commonMistake": "Use “stay within budget” for keeping to a spending limit, and “go over budget” for spending too much.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c173868c695f2c93.svg",
          "kind": "scene",
          "altEn": "A fixed amount of money is divided between planned expenses.",
          "altJa": "決まった金額を、予定した費用に分けた予算。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "business-and-projects"
      },
      "icon": "",
      "tags": [
        "business-and-projects",
        "level-28",
        "budget"
      ]
    }
  },
  {
    "id": "word-l28-priority",
    "category": "words",
    "level": 28,
    "before_fields": {
      "title_en": "priority",
      "title_ja": "優先事項",
      "content": {
        "word": "priority",
        "japanese": "優先事項",
        "kanaReading": "プライオリティー",
        "pronunciationHint": "Stress OR: pri-OR-i-ty.",
        "exampleSentence": "Safety is our first priority.",
        "exampleJapanese": "安全が私たちの最優先事項です。",
        "commonMistake": "“Top priority” is natural; avoid redundant “most top priority.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "business-and-projects"
      },
      "icon": "🥇",
      "tags": [
        "business-and-projects",
        "level-28",
        "priority"
      ]
    },
    "after_fields": {
      "title_en": "priority",
      "title_ja": "優先事項",
      "content": {
        "word": "priority",
        "japanese": "優先事項",
        "kanaReading": "プライオリティー",
        "pronunciationHint": "Stress OR: pri-OR-i-ty.",
        "exampleSentence": "Safety is our first priority.",
        "exampleJapanese": "安全が私たちの最優先事項です。",
        "commonMistake": "“Top priority” is natural; avoid redundant “most top priority.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-2a8ec2ed0665eb74.svg",
          "kind": "scene",
          "altEn": "The most important task is placed above the others and marked with a star.",
          "altJa": "一番大切な作業をリストの先頭に置き、星で示しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "business-and-projects"
      },
      "icon": "",
      "tags": [
        "business-and-projects",
        "level-28",
        "priority"
      ]
    }
  },
  {
    "id": "word-l28-strategy",
    "category": "words",
    "level": 28,
    "before_fields": {
      "title_en": "strategy",
      "title_ja": "戦略",
      "content": {
        "word": "strategy",
        "japanese": "戦略",
        "kanaReading": "ストラテジー",
        "pronunciationHint": "Stress STRAT; g sounds /dʒ/.",
        "exampleSentence": "We need a simple launch strategy.",
        "exampleJapanese": "簡単な立ち上げ戦略が必要です。",
        "commonMistake": "A strategy is an overall approach; a tactic is one action.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "business-and-projects"
      },
      "icon": "♟️",
      "tags": [
        "business-and-projects",
        "level-28",
        "strategy"
      ]
    },
    "after_fields": {
      "title_en": "strategy",
      "title_ja": "戦略",
      "content": {
        "word": "strategy",
        "japanese": "戦略",
        "kanaReading": "ストラテジー",
        "pronunciationHint": "Stress STRAT; g sounds /dʒ/.",
        "exampleSentence": "We need a simple launch strategy.",
        "exampleJapanese": "簡単な立ち上げ戦略が必要です。",
        "commonMistake": "A strategy is an overall approach; a tactic is one action.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c7cd83d017f39702.svg",
          "kind": "scene",
          "altEn": "A planned route connects a starting point to a goal while avoiding an obstacle.",
          "altJa": "障害を避けながら目標に向かう道筋を計画しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "business-and-projects"
      },
      "icon": "",
      "tags": [
        "business-and-projects",
        "level-28",
        "strategy"
      ]
    }
  },
  {
    "id": "word-l28-progress",
    "category": "words",
    "level": 28,
    "before_fields": {
      "title_en": "progress",
      "title_ja": "進捗・進歩",
      "content": {
        "word": "progress",
        "japanese": "進捗・進歩",
        "kanaReading": "プログレス",
        "pronunciationHint": "As a noun, stress PRO.",
        "exampleSentence": "We review progress every Friday.",
        "exampleJapanese": "毎週金曜日に進捗を確認します。",
        "commonMistake": "“Progress” is uncountable; avoid “progresses” for general advancement.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "business-and-projects"
      },
      "icon": "📈",
      "tags": [
        "business-and-projects",
        "level-28",
        "progress"
      ]
    },
    "after_fields": {
      "title_en": "progress",
      "title_ja": "進捗・進歩",
      "content": {
        "word": "progress",
        "japanese": "進捗・進歩",
        "kanaReading": "プログレス",
        "pronunciationHint": "As a noun, stress PRO.",
        "exampleSentence": "We review progress every Friday.",
        "exampleJapanese": "毎週金曜日に進捗を確認します。",
        "commonMistake": "“Progress” is uncountable; avoid “progresses” for general advancement.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7f9e4e7657a4cc60.svg",
          "kind": "sequence",
          "altEn": "More parts of a shared task are complete at each stage.",
          "altJa": "段階が進むごとに、作業の完成した部分が増えています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "business-and-projects"
      },
      "icon": "",
      "tags": [
        "business-and-projects",
        "level-28",
        "progress"
      ]
    }
  },
  {
    "id": "word-l28-feedback",
    "category": "words",
    "level": 28,
    "before_fields": {
      "title_en": "feedback",
      "title_ja": "フィードバック・意見",
      "content": {
        "word": "feedback",
        "japanese": "フィードバック・意見",
        "kanaReading": "フィードバック",
        "pronunciationHint": "Stress FEED and connect both parts.",
        "exampleSentence": "Your specific feedback improved the draft.",
        "exampleJapanese": "具体的なフィードバックのおかげで下書きが改善しました。",
        "commonMistake": "“Feedback” is uncountable; avoid “feedbacks.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "business-and-projects"
      },
      "icon": "🗨️",
      "tags": [
        "business-and-projects",
        "level-28",
        "feedback"
      ]
    },
    "after_fields": {
      "title_en": "feedback",
      "title_ja": "フィードバック・意見",
      "content": {
        "word": "feedback",
        "japanese": "フィードバック・意見",
        "kanaReading": "フィードバック",
        "pronunciationHint": "Stress FEED and connect both parts.",
        "exampleSentence": "Your specific feedback improved the draft.",
        "exampleJapanese": "具体的なフィードバックのおかげで下書きが改善しました。",
        "commonMistake": "“Feedback” is uncountable; avoid “feedbacks.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b3ecf788763bb2a7.svg",
          "kind": "scene",
          "altEn": "Someone gives specific comments on a learner’s work to help improve it.",
          "altJa": "課題のよい点と直す点を具体的に伝えています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "business-and-projects"
      },
      "icon": "",
      "tags": [
        "business-and-projects",
        "level-28",
        "feedback"
      ]
    }
  },
  {
    "id": "word-l28-negotiate",
    "category": "words",
    "level": 28,
    "before_fields": {
      "title_en": "negotiate",
      "title_ja": "交渉する",
      "content": {
        "word": "negotiate",
        "japanese": "交渉する",
        "kanaReading": "ニゴウシエイト",
        "pronunciationHint": "Stress GO: ne-GO-ti-ate.",
        "exampleSentence": "They negotiated a later delivery date.",
        "exampleJapanese": "彼らは配達日を遅らせる交渉をしました。",
        "commonMistake": "Negotiate “with” a person and “for/about” terms.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "business-and-projects"
      },
      "icon": "🤝",
      "tags": [
        "business-and-projects",
        "level-28",
        "negotiate"
      ]
    },
    "after_fields": {
      "title_en": "negotiate",
      "title_ja": "交渉する",
      "content": {
        "word": "negotiate",
        "japanese": "交渉する",
        "kanaReading": "ニゴウシエイト",
        "pronunciationHint": "Stress GO: ne-GO-ti-ate.",
        "exampleSentence": "They negotiated a later delivery date.",
        "exampleJapanese": "彼らは配達日を遅らせる交渉をしました。",
        "commonMistake": "Negotiate “with” a person and “for/about” terms.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-41a63b018c0f8202.svg",
          "kind": "sequence",
          "altEn": "People discuss price and timing before reaching an agreement.",
          "altJa": "値段と日程について話し合い、合意を目指しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "business-and-projects"
      },
      "icon": "",
      "tags": [
        "business-and-projects",
        "level-28",
        "negotiate"
      ]
    }
  },
  {
    "id": "word-l28-approve",
    "category": "words",
    "level": 28,
    "before_fields": {
      "title_en": "approve",
      "title_ja": "承認する・賛成する",
      "content": {
        "word": "approve",
        "japanese": "承認する・賛成する",
        "kanaReading": "アプルーヴ",
        "pronunciationHint": "Stress PROVE and finish with voiced v.",
        "exampleSentence": "The client approved the final design.",
        "exampleJapanese": "顧客は最終デザインを承認しました。",
        "commonMistake": "Approve a thing directly; approve “of” behavior or an idea generally.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "business-and-projects"
      },
      "icon": "✅",
      "tags": [
        "business-and-projects",
        "level-28",
        "approve"
      ]
    },
    "after_fields": {
      "title_en": "approve",
      "title_ja": "承認する・賛成する",
      "content": {
        "word": "approve",
        "japanese": "承認する・賛成する",
        "kanaReading": "アプルーヴ",
        "pronunciationHint": "Stress PROVE and finish with voiced v.",
        "exampleSentence": "The client approved the final design.",
        "exampleJapanese": "顧客は最終デザインを承認しました。",
        "commonMistake": "Approve a thing directly; approve “of” behavior or an idea generally.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-8aa71682908921a5.svg",
          "kind": "scene",
          "altEn": "A decision maker marks a submitted plan as approved.",
          "altJa": "提出された計画に、承認のしるしがついています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "business-and-projects"
      },
      "icon": "",
      "tags": [
        "business-and-projects",
        "level-28",
        "approve"
      ]
    }
  },
  {
    "id": "word-l28-revise",
    "category": "words",
    "level": 28,
    "before_fields": {
      "title_en": "revise",
      "title_ja": "修正する・復習する",
      "content": {
        "word": "revise",
        "japanese": "修正する・復習する",
        "kanaReading": "リヴァイズ",
        "pronunciationHint": "Stress VISE and finish with voiced /z/.",
        "exampleSentence": "Please revise the opening paragraph.",
        "exampleJapanese": "冒頭の段落を修正してください。",
        "commonMistake": "In UK education, “revise” can mean study again; context matters.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "business-and-projects"
      },
      "icon": "✏️",
      "tags": [
        "business-and-projects",
        "level-28",
        "revise"
      ]
    },
    "after_fields": {
      "title_en": "revise",
      "title_ja": "修正する・復習する",
      "content": {
        "word": "revise",
        "japanese": "修正する・復習する",
        "kanaReading": "リヴァイズ",
        "pronunciationHint": "Stress VISE and finish with voiced /z/.",
        "exampleSentence": "Please revise the opening paragraph.",
        "exampleJapanese": "冒頭の段落を修正してください。",
        "commonMistake": "In UK education, “revise” can mean study again; context matters.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-87adab98f9b6f2f3.svg",
          "kind": "sequence",
          "altEn": "A writer changes and improves a draft with visible edits.",
          "altJa": "下書きの文章を書き直して改善しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "business-and-projects"
      },
      "icon": "",
      "tags": [
        "business-and-projects",
        "level-28",
        "revise"
      ]
    }
  },
  {
    "id": "word-l28-launch",
    "category": "words",
    "level": 28,
    "before_fields": {
      "title_en": "launch",
      "title_ja": "開始する・発売する",
      "content": {
        "word": "launch",
        "japanese": "開始する・発売する",
        "kanaReading": "ローンチ",
        "pronunciationHint": "Finish with /ntʃ/.",
        "exampleSentence": "We will launch the new course in April.",
        "exampleJapanese": "4月に新しいコースを開始します。",
        "commonMistake": "Use “launch a product,” not “open a product.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "business-and-projects"
      },
      "icon": "🚀",
      "tags": [
        "business-and-projects",
        "level-28",
        "launch"
      ]
    },
    "after_fields": {
      "title_en": "launch",
      "title_ja": "開始する・発売する",
      "content": {
        "word": "launch",
        "japanese": "開始する・発売する",
        "kanaReading": "ローンチ",
        "pronunciationHint": "Finish with /ntʃ/.",
        "exampleSentence": "We will launch the new course in April.",
        "exampleJapanese": "4月に新しいコースを開始します。",
        "commonMistake": "Use “launch a product,” not “open a product.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-206f7f567297c5e0.svg",
          "kind": "scene",
          "altEn": "A completed app becomes available to people for the first time.",
          "altJa": "完成したアプリを初めて公開し、使えるようにします。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "business-and-projects"
      },
      "icon": "",
      "tags": [
        "business-and-projects",
        "level-28",
        "launch"
      ]
    }
  },
  {
    "id": "word-l29-luggage",
    "category": "words",
    "level": 29,
    "before_fields": {
      "title_en": "luggage",
      "title_ja": "荷物",
      "content": {
        "word": "luggage",
        "japanese": "荷物",
        "kanaReading": "ラゲッジ",
        "pronunciationHint": "Stress LUG; g sounds /dʒ/.",
        "exampleSentence": "Your luggage can go under the seat.",
        "exampleJapanese": "荷物は座席の下に置けます。",
        "commonMistake": "“Luggage” is uncountable; say “a piece of luggage.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "travel-details"
      },
      "icon": "🧳",
      "tags": [
        "travel-details",
        "level-29",
        "luggage"
      ]
    },
    "after_fields": {
      "title_en": "luggage",
      "title_ja": "荷物",
      "content": {
        "word": "luggage",
        "japanese": "荷物",
        "kanaReading": "ラゲッジ",
        "pronunciationHint": "Stress LUG; g sounds /dʒ/.",
        "exampleSentence": "Could you tell me where to report missing luggage?",
        "exampleJapanese": "荷物が届かない場合、どこに届け出ればよいか教えていただけますか。",
        "commonMistake": "“Luggage” is uncountable; say “a piece of luggage.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-347fa0d944d69616.svg",
          "kind": "scene",
          "altEn": "A suitcase and a travel bag are grouped together as luggage.",
          "altJa": "旅行用のスーツケースとかばんをまとめた荷物。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "travel-details"
      },
      "icon": "",
      "tags": [
        "travel-details",
        "level-29",
        "luggage"
      ]
    }
  },
  {
    "id": "word-l29-passport",
    "category": "words",
    "level": 29,
    "before_fields": {
      "title_en": "passport",
      "title_ja": "パスポート",
      "content": {
        "word": "passport",
        "japanese": "パスポート",
        "kanaReading": "パスポート",
        "pronunciationHint": "Stress PASS and keep the final t.",
        "exampleSentence": "Keep your passport in a safe place.",
        "exampleJapanese": "パスポートを安全な場所に保管してください。",
        "commonMistake": "Do not drop the final t.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "travel-details"
      },
      "icon": "🛂",
      "tags": [
        "travel-details",
        "level-29",
        "passport"
      ]
    },
    "after_fields": {
      "title_en": "passport",
      "title_ja": "パスポート",
      "content": {
        "word": "passport",
        "japanese": "パスポート",
        "kanaReading": "パスポート",
        "pronunciationHint": "Stress PASS and keep the final t.",
        "exampleSentence": "I had to renew my passport before I could book the trip.",
        "exampleJapanese": "旅行を予約する前に、パスポートを更新する必要がありました。",
        "commonMistake": "Use “renew a passport” when you need a new period of validity. “Update” usually describes changing information.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-14354d2aed82f902.svg",
          "kind": "single",
          "altEn": "An illustration of passport.",
          "altJa": "パスポートのイラスト。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "travel-details"
      },
      "icon": "",
      "tags": [
        "travel-details",
        "level-29",
        "passport"
      ]
    }
  },
  {
    "id": "word-l29-customs",
    "category": "words",
    "level": 29,
    "before_fields": {
      "title_en": "customs",
      "title_ja": "税関",
      "content": {
        "word": "customs",
        "japanese": "税関",
        "kanaReading": "カスタムズ",
        "pronunciationHint": "Finish with voiced /z/.",
        "exampleSentence": "We went through customs quickly.",
        "exampleJapanese": "私たちはすぐに税関を通過しました。",
        "commonMistake": "Use plural-form “customs” for the border service.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "travel-details"
      },
      "icon": "🛃",
      "tags": [
        "travel-details",
        "level-29",
        "customs"
      ]
    },
    "after_fields": {
      "title_en": "customs",
      "title_ja": "税関",
      "content": {
        "word": "customs",
        "japanese": "税関",
        "kanaReading": "カスタムズ",
        "pronunciationHint": "Finish with voiced /z/.",
        "exampleSentence": "We were asked to declare the food we were carrying at customs.",
        "exampleJapanese": "税関で、持っていた食品を申告するよう求められました。",
        "commonMistake": "Use plural-form “customs” for the border service.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-a10b05677cd9c7fb.svg",
          "kind": "scene",
          "altEn": "At a border inspection desk, a traveller declares the contents of their luggage.",
          "altJa": "国境の検査窓口で、旅行者が荷物の中身を申告しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "travel-details"
      },
      "icon": "",
      "tags": [
        "travel-details",
        "level-29",
        "customs"
      ]
    }
  },
  {
    "id": "word-l29-destination",
    "category": "words",
    "level": 29,
    "before_fields": {
      "title_en": "destination",
      "title_ja": "目的地",
      "content": {
        "word": "destination",
        "japanese": "目的地",
        "kanaReading": "デスティネイション",
        "pronunciationHint": "Stress NA and pronounce tion /ʃən/.",
        "exampleSentence": "Kyoto is our final destination.",
        "exampleJapanese": "京都が私たちの最終目的地です。",
        "commonMistake": "A destination is the place you are going, not the route.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "travel-details"
      },
      "icon": "📍",
      "tags": [
        "travel-details",
        "level-29",
        "destination"
      ]
    },
    "after_fields": {
      "title_en": "destination",
      "title_ja": "目的地",
      "content": {
        "word": "destination",
        "japanese": "目的地",
        "kanaReading": "デスティネイション",
        "pronunciationHint": "Stress NA and pronounce tion /ʃən/.",
        "exampleSentence": "We changed our destination after the original flight was canceled.",
        "exampleJapanese": "最初の便が欠航したので、私たちは目的地を変更しました。",
        "commonMistake": "A destination is the place you are going, not the route.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-64d78a82d9a54c2e.svg",
          "kind": "scene",
          "altEn": "A route ends at a highlighted place where the traveller wants to go.",
          "altJa": "移動ルートの終わりに、行きたい目的地が示されています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "travel-details"
      },
      "icon": "",
      "tags": [
        "travel-details",
        "level-29",
        "destination"
      ]
    }
  },
  {
    "id": "word-l29-accommodation",
    "category": "words",
    "level": 29,
    "before_fields": {
      "title_en": "accommodation",
      "title_ja": "宿泊施設",
      "content": {
        "word": "accommodation",
        "japanese": "宿泊施設",
        "kanaReading": "アコモデイション",
        "pronunciationHint": "Stress DA: accom-mo-DA-tion.",
        "exampleSentence": "The price includes accommodation and breakfast.",
        "exampleJapanese": "料金には宿泊と朝食が含まれています。",
        "commonMistake": "“Accommodation” is usually uncountable in UK English.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "travel-details"
      },
      "icon": "🏨",
      "tags": [
        "travel-details",
        "level-29",
        "accommodation"
      ]
    },
    "after_fields": {
      "title_en": "accommodation",
      "title_ja": "宿泊施設",
      "content": {
        "word": "accommodation",
        "japanese": "宿泊施設",
        "kanaReading": "アコモデイション",
        "pronunciationHint": "Stress DA: accom-mo-DA-tion.",
        "exampleSentence": "We need to arrange accommodation within walking distance of the station.",
        "exampleJapanese": "駅から歩ける範囲で宿泊先を手配する必要があります。",
        "commonMistake": "“Accommodation” is usually uncountable in UK English.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ee3abeb0758083f5.svg",
          "kind": "scene",
          "altEn": "A place to stay has a room, bed, and a guest key.",
          "altJa": "泊まる場所に、部屋とベッド、宿泊用の鍵があります。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "travel-details"
      },
      "icon": "",
      "tags": [
        "travel-details",
        "level-29",
        "accommodation"
      ]
    }
  },
  {
    "id": "word-l29-reservation",
    "category": "words",
    "level": 29,
    "before_fields": {
      "title_en": "reservation",
      "title_ja": "予約",
      "content": {
        "word": "reservation",
        "japanese": "予約",
        "kanaReading": "レザヴェイション",
        "pronunciationHint": "Stress VA.",
        "exampleSentence": "I changed the reservation online.",
        "exampleJapanese": "オンラインで予約を変更しました。",
        "commonMistake": "A reservation is the booking record; a reserve is not the noun here.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "travel-details"
      },
      "icon": "📋",
      "tags": [
        "travel-details",
        "level-29",
        "reservation"
      ]
    },
    "after_fields": {
      "title_en": "reservation",
      "title_ja": "予約",
      "content": {
        "word": "reservation",
        "japanese": "予約",
        "kanaReading": "レザヴェイション",
        "pronunciationHint": "Stress VA.",
        "exampleSentence": "Could you confirm whether my reservation includes breakfast?",
        "exampleJapanese": "私の予約に朝食が含まれるか確認していただけますか。",
        "commonMistake": "A reservation is the booking record; a reserve is not the noun here.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c223660ce8d4dbb3.svg",
          "kind": "scene",
          "altEn": "A hotel room is booked for specific dates and the booking is confirmed.",
          "altJa": "決まった日付で客室を予約し、予約内容を確認しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "travel-details"
      },
      "icon": "",
      "tags": [
        "travel-details",
        "level-29",
        "reservation"
      ]
    }
  },
  {
    "id": "word-l29-departure",
    "category": "words",
    "level": 29,
    "before_fields": {
      "title_en": "departure",
      "title_ja": "出発",
      "content": {
        "word": "departure",
        "japanese": "出発",
        "kanaReading": "ディパーチャー",
        "pronunciationHint": "Stress PAR.",
        "exampleSentence": "Check the departure time on the board.",
        "exampleJapanese": "掲示板で出発時刻を確認してください。",
        "commonMistake": "Departure is leaving; arrival is reaching the destination.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "travel-details"
      },
      "icon": "🛫",
      "tags": [
        "travel-details",
        "level-29",
        "departure"
      ]
    },
    "after_fields": {
      "title_en": "departure",
      "title_ja": "出発",
      "content": {
        "word": "departure",
        "japanese": "出発",
        "kanaReading": "ディパーチャー",
        "pronunciationHint": "Stress PAR.",
        "exampleSentence": "Our departure was brought forward, so we had to leave the hotel earlier.",
        "exampleJapanese": "出発時刻が早まったので、ホテルをもっと早く出なければなりませんでした。",
        "commonMistake": "Departure is leaving; arrival is reaching the destination.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-7bd84c02a013c5cb.svg",
          "kind": "scene",
          "altEn": "An aircraft leaves at the time shown on a departure board.",
          "altJa": "出発案内に表示された時刻に、飛行機が出発します。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "travel-details"
      },
      "icon": "",
      "tags": [
        "travel-details",
        "level-29",
        "departure"
      ]
    }
  },
  {
    "id": "word-l29-arrival",
    "category": "words",
    "level": 29,
    "before_fields": {
      "title_en": "arrival",
      "title_ja": "到着",
      "content": {
        "word": "arrival",
        "japanese": "到着",
        "kanaReading": "アライヴァル",
        "pronunciationHint": "Stress RI: ar-RI-val.",
        "exampleSentence": "Please wait in the arrival hall.",
        "exampleJapanese": "到着ロビーで待ってください。",
        "commonMistake": "Use “on arrival” for the moment you reach a place.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "travel-details"
      },
      "icon": "🛬",
      "tags": [
        "travel-details",
        "level-29",
        "arrival"
      ]
    },
    "after_fields": {
      "title_en": "arrival",
      "title_ja": "到着",
      "content": {
        "word": "arrival",
        "japanese": "到着",
        "kanaReading": "アライヴァル",
        "pronunciationHint": "Stress RI: ar-RI-val.",
        "exampleSentence": "Please let the hotel know your estimated time of arrival.",
        "exampleJapanese": "到着予定時刻をホテルに知らせてください。",
        "commonMistake": "“On arrival” means when you reach a place. At an airport, the usual sign is “Arrivals,” and the room is the “arrivals hall.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-40aabb2ff2cdfeb7.svg",
          "kind": "scene",
          "altEn": "A flight lands and a traveller reaches the arrivals area.",
          "altJa": "飛行機が着陸し、旅行者が到着エリアに着きます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "travel-details"
      },
      "icon": "",
      "tags": [
        "travel-details",
        "level-29",
        "arrival"
      ]
    }
  },
  {
    "id": "word-l29-platform",
    "category": "words",
    "level": 29,
    "before_fields": {
      "title_en": "platform",
      "title_ja": "ホーム・台",
      "content": {
        "word": "platform",
        "japanese": "ホーム・台",
        "kanaReading": "プラットフォーム",
        "pronunciationHint": "Stress PLAT.",
        "exampleSentence": "The train leaves from platform six.",
        "exampleJapanese": "電車は6番ホームから出ます。",
        "commonMistake": "Use “on the platform,” not “in the platform.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "travel-details"
      },
      "icon": "🚉",
      "tags": [
        "travel-details",
        "level-29",
        "platform"
      ]
    },
    "after_fields": {
      "title_en": "platform",
      "title_ja": "ホーム・台",
      "content": {
        "word": "platform",
        "japanese": "ホーム・台",
        "kanaReading": "プラットフォーム",
        "pronunciationHint": "Stress PLAT.",
        "exampleSentence": "The platform changed at the last minute, and we nearly missed the train.",
        "exampleJapanese": "直前にホームが変更になり、もう少しで電車に乗り遅れるところでした。",
        "commonMistake": "Use “on the platform,” not “in the platform.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-15722809ae7ebc88.svg",
          "kind": "scene",
          "altEn": "A passenger waits on the raised platform beside train doors.",
          "altJa": "乗客が電車のドアの横にあるホームで待っています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "travel-details"
      },
      "icon": "",
      "tags": [
        "travel-details",
        "level-29",
        "platform"
      ]
    }
  },
  {
    "id": "word-l29-transfer",
    "category": "words",
    "level": 29,
    "before_fields": {
      "title_en": "transfer",
      "title_ja": "乗り換え・移す",
      "content": {
        "word": "transfer",
        "japanese": "乗り換え・移す",
        "kanaReading": "トランスファー",
        "pronunciationHint": "As a noun, stress TRANS; as a verb, stress FER.",
        "exampleSentence": "We have a short transfer in Seoul.",
        "exampleJapanese": "ソウルで短い乗り継ぎがあります。",
        "commonMistake": "Stress changes between common noun and verb uses.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "travel-details"
      },
      "icon": "🔀",
      "tags": [
        "travel-details",
        "level-29",
        "transfer"
      ]
    },
    "after_fields": {
      "title_en": "transfer",
      "title_ja": "乗り換え・移す",
      "content": {
        "word": "transfer",
        "japanese": "乗り換え・移す",
        "kanaReading": "トランスファー",
        "pronunciationHint": "As a noun, stress TRANS; as a verb, stress FER.",
        "exampleSentence": "We missed our connection because the airport transfer took longer than expected.",
        "exampleJapanese": "空港間の移動が予想以上にかかり、乗り継ぎ便に間に合いませんでした。",
        "commonMistake": "An airport transfer is transport between an airport and another place. A connection is the next flight or train you catch.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c5626c4a1bc9576c.svg",
          "kind": "sequence",
          "altEn": "A shuttle bus takes a traveller between two airports for a connecting flight.",
          "altJa": "乗り継ぎ便のために、バスで空港間を移動しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "travel-details"
      },
      "icon": "",
      "tags": [
        "travel-details",
        "level-29",
        "transfer"
      ]
    }
  },
  {
    "id": "word-l30-manage",
    "category": "words",
    "level": 30,
    "before_fields": {
      "title_en": "manage",
      "title_ja": "何とかする・管理する",
      "content": {
        "word": "manage",
        "japanese": "何とかする・管理する",
        "kanaReading": "マネジ",
        "pronunciationHint": "Stress MAN and end with /ɪdʒ/.",
        "exampleSentence": "I managed to finish before the deadline.",
        "exampleJapanese": "締め切り前になんとか終えました。",
        "commonMistake": "Use “manage to do,” not “manage doing,” for succeeding.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "high-utility-verbs"
      },
      "icon": "🧩",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "manage"
      ]
    },
    "after_fields": {
      "title_en": "manage",
      "title_ja": "何とかする・管理する",
      "content": {
        "word": "manage",
        "japanese": "何とかする・管理する",
        "kanaReading": "マネジ",
        "pronunciationHint": "Stress MAN and end with /ɪdʒ/.",
        "exampleSentence": "I managed to finish before the deadline.",
        "exampleJapanese": "締め切り前になんとか終えました。",
        "commonMistake": "Use “manage to do,” not “manage doing,” for succeeding.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4da1440e7401f45b.svg",
          "kind": "sequence",
          "altEn": "A busy person completes a difficult task before time runs out.",
          "altJa": "忙しい人が、なんとか時間内に難しい作業を終えています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "high-utility-verbs"
      },
      "icon": "",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "manage"
      ]
    }
  },
  {
    "id": "word-l30-avoid",
    "category": "words",
    "level": 30,
    "before_fields": {
      "title_en": "avoid",
      "title_ja": "避ける",
      "content": {
        "word": "avoid",
        "japanese": "避ける",
        "kanaReading": "アヴォイド",
        "pronunciationHint": "Stress VOID.",
        "exampleSentence": "Try to avoid checking your phone while studying.",
        "exampleJapanese": "勉強中に携帯を見るのを避けてみてください。",
        "commonMistake": "Use “avoid doing,” not “avoid to do.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "high-utility-verbs"
      },
      "icon": "🚫",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "avoid"
      ]
    },
    "after_fields": {
      "title_en": "avoid",
      "title_ja": "避ける",
      "content": {
        "word": "avoid",
        "japanese": "避ける",
        "kanaReading": "アヴォイド",
        "pronunciationHint": "Stress VOID.",
        "exampleSentence": "Try to avoid checking your phone while studying.",
        "exampleJapanese": "勉強中に携帯を見るのを避けてみてください。",
        "commonMistake": "Use “avoid doing,” not “avoid to do.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-d288db8de55f0103.svg",
          "kind": "scene",
          "altEn": "A person changes direction to stay clear of a puddle.",
          "altJa": "水たまりを避けて、進む方向を変えて歩く人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "high-utility-verbs"
      },
      "icon": "",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "avoid"
      ]
    }
  },
  {
    "id": "word-l30-afford",
    "category": "words",
    "level": 30,
    "before_fields": {
      "title_en": "afford",
      "title_ja": "余裕がある・購入できる",
      "content": {
        "word": "afford",
        "japanese": "余裕がある・購入できる",
        "kanaReading": "アフォード",
        "pronunciationHint": "Stress FORD.",
        "exampleSentence": "We cannot afford a longer delay.",
        "exampleJapanese": "これ以上の遅れは許容できません。",
        "commonMistake": "Use “afford to do” or “afford something,” not “afford for.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "high-utility-verbs"
      },
      "icon": "💳",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "afford"
      ]
    },
    "after_fields": {
      "title_en": "afford",
      "title_ja": "余裕がある・購入できる",
      "content": {
        "word": "afford",
        "japanese": "余裕がある・購入できる",
        "kanaReading": "アフォード",
        "pronunciationHint": "Stress FORD.",
        "exampleSentence": "We cannot afford a longer delay.",
        "exampleJapanese": "これ以上の遅れは許容できません。",
        "commonMistake": "Use “afford to do” or “afford something,” not “afford for.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5a23bb65ff7e5d73.svg",
          "kind": "contrast",
          "altEn": "Money saved is enough to pay the bicycle’s price.",
          "altJa": "貯めたお金が自転車の値段に足り、購入できる状態。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "high-utility-verbs"
      },
      "icon": "",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "afford"
      ]
    }
  },
  {
    "id": "word-l30-recommend",
    "category": "words",
    "level": 30,
    "before_fields": {
      "title_en": "recommend",
      "title_ja": "勧める",
      "content": {
        "word": "recommend",
        "japanese": "勧める",
        "kanaReading": "レコメンド",
        "pronunciationHint": "Stress MEND.",
        "exampleSentence": "I recommend taking the earlier train.",
        "exampleJapanese": "早い電車に乗ることを勧めます。",
        "commonMistake": "Use “recommend doing” or “recommend that…,” not “recommend you to do.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "high-utility-verbs"
      },
      "icon": "👍",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "recommend"
      ]
    },
    "after_fields": {
      "title_en": "recommend",
      "title_ja": "勧める",
      "content": {
        "word": "recommend",
        "japanese": "勧める",
        "kanaReading": "レコメンド",
        "pronunciationHint": "Stress MEND.",
        "exampleSentence": "I recommend taking the earlier train.",
        "exampleJapanese": "早い電車に乗ることを勧めます。",
        "commonMistake": "Use “recommend doing” or “recommend that…,” not “recommend you to do.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-26337a56fcb62268.svg",
          "kind": "scene",
          "altEn": "Someone points out one book as a good choice for a reader.",
          "altJa": "読者に合う一冊の本を、よい選択として勧めています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "high-utility-verbs"
      },
      "icon": "",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "recommend"
      ]
    }
  },
  {
    "id": "word-l30-suggest",
    "category": "words",
    "level": 30,
    "before_fields": {
      "title_en": "suggest",
      "title_ja": "提案する・示唆する",
      "content": {
        "word": "suggest",
        "japanese": "提案する・示唆する",
        "kanaReading": "サジェスト",
        "pronunciationHint": "Stress GEST.",
        "exampleSentence": "She suggested meeting near the station.",
        "exampleJapanese": "彼女は駅の近くで会うことを提案しました。",
        "commonMistake": "Use “suggest doing,” not “suggest to do.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "high-utility-verbs"
      },
      "icon": "💡",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "suggest"
      ]
    },
    "after_fields": {
      "title_en": "suggest",
      "title_ja": "提案する・示唆する",
      "content": {
        "word": "suggest",
        "japanese": "提案する・示唆する",
        "kanaReading": "サジェスト",
        "pronunciationHint": "Stress GEST.",
        "exampleSentence": "She suggested meeting near the station.",
        "exampleJapanese": "彼女は駅の近くで会うことを提案しました。",
        "commonMistake": "Use “suggest doing,” not “suggest to do.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-5d919f29742071ee.svg",
          "kind": "scene",
          "altEn": "A person offers a new idea for the group to consider.",
          "altJa": "グループに考えてもらうため、新しい案を出す人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "high-utility-verbs"
      },
      "icon": "",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "suggest"
      ]
    }
  },
  {
    "id": "word-l30-prefer",
    "category": "words",
    "level": 30,
    "before_fields": {
      "title_en": "prefer",
      "title_ja": "より好む",
      "content": {
        "word": "prefer",
        "japanese": "より好む",
        "kanaReading": "プリファー",
        "pronunciationHint": "Stress FER.",
        "exampleSentence": "I prefer tea without sugar.",
        "exampleJapanese": "私は砂糖なしの紅茶のほうが好きです。",
        "commonMistake": "Say “prefer A to B,” not “prefer A than B.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "high-utility-verbs"
      },
      "icon": "☕",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "prefer"
      ]
    },
    "after_fields": {
      "title_en": "prefer",
      "title_ja": "より好む",
      "content": {
        "word": "prefer",
        "japanese": "より好む",
        "kanaReading": "プリファー",
        "pronunciationHint": "Stress FER.",
        "exampleSentence": "I'd prefer to wait until we have all the details.",
        "exampleJapanese": "詳細がすべて分かるまで待ちたいです。",
        "commonMistake": "Say “prefer A to B,” not “prefer A than B.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-aa7c324a4f9892c8.svg",
          "kind": "scene",
          "altEn": "A person chooses tea over coffee when both are offered.",
          "altJa": "紅茶とコーヒーの両方がある中で、紅茶を好んで選びます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "high-utility-verbs"
      },
      "icon": "",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "prefer"
      ]
    }
  },
  {
    "id": "word-l30-depend",
    "category": "words",
    "level": 30,
    "before_fields": {
      "title_en": "depend",
      "title_ja": "左右される・頼る",
      "content": {
        "word": "depend",
        "japanese": "左右される・頼る",
        "kanaReading": "ディペンド",
        "pronunciationHint": "Stress PEND.",
        "exampleSentence": "The finish time depends on the weather.",
        "exampleJapanese": "終了時刻は天候によります。",
        "commonMistake": "Use “depend on,” not “depend of.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "high-utility-verbs"
      },
      "icon": "🔗",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "depend"
      ]
    },
    "after_fields": {
      "title_en": "depend",
      "title_ja": "左右される・頼る",
      "content": {
        "word": "depend",
        "japanese": "左右される・頼る",
        "kanaReading": "ディペンド",
        "pronunciationHint": "Stress PEND.",
        "exampleSentence": "The finish time depends on the weather.",
        "exampleJapanese": "終了時刻は天候によります。",
        "commonMistake": "Use “depend on,” not “depend of.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-f39abe9712f4f459.svg",
          "kind": "contrast",
          "altEn": "Whether an outdoor game goes ahead changes with the weather.",
          "altJa": "屋外の試合ができるかは、雨か晴れかによって変わります。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "high-utility-verbs"
      },
      "icon": "",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "depend"
      ]
    }
  },
  {
    "id": "word-l30-notice",
    "category": "words",
    "level": 30,
    "before_fields": {
      "title_en": "notice",
      "title_ja": "気づく・通知",
      "content": {
        "word": "notice",
        "japanese": "気づく・通知",
        "kanaReading": "ノウティス",
        "pronunciationHint": "Stress NO and finish with /s/.",
        "exampleSentence": "Did you notice the change in tone?",
        "exampleJapanese": "口調の変化に気づきましたか。",
        "commonMistake": "“Notice” is observing; “realize” is understanding a fact.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "high-utility-verbs"
      },
      "icon": "👀",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "notice"
      ]
    },
    "after_fields": {
      "title_en": "notice",
      "title_ja": "気づく",
      "content": {
        "word": "notice",
        "japanese": "気づく",
        "kanaReading": "ノウティス",
        "pronunciationHint": "Stress NO and finish with /s/.",
        "exampleSentence": "Did you notice the change in tone?",
        "exampleJapanese": "口調の変化に気づきましたか。",
        "commonMistake": "“Notice” is observing; “realize” is understanding a fact.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4a28e4c95505f955.svg",
          "kind": "scene",
          "altEn": "A person spots one small error on an otherwise correct page.",
          "altJa": "正しそうな紙の中に、一つの小さな間違いを見つける人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "high-utility-verbs"
      },
      "icon": "",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "notice"
      ]
    }
  },
  {
    "id": "word-l30-realize",
    "category": "words",
    "level": 30,
    "before_fields": {
      "title_en": "realize",
      "title_ja": "気づく・理解する",
      "content": {
        "word": "realize",
        "japanese": "気づく・理解する",
        "kanaReading": "リアライズ",
        "pronunciationHint": "Stress RE and finish with voiced /z/.",
        "exampleSentence": "I realized that I had the wrong date.",
        "exampleJapanese": "日付を間違えていたことに気づきました。",
        "commonMistake": "US spelling is “realize”; UK also accepts “realise.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "high-utility-verbs"
      },
      "icon": "💡",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "realize"
      ]
    },
    "after_fields": {
      "title_en": "realize",
      "title_ja": "気づく・理解する",
      "content": {
        "word": "realize",
        "japanese": "気づく・理解する",
        "kanaReading": "リアライズ",
        "pronunciationHint": "Stress RE and finish with voiced /z/.",
        "exampleSentence": "I realized that I had the wrong date.",
        "exampleJapanese": "日付を間違えていたことに気づきました。",
        "commonMistake": "US spelling is “realize”; UK also accepts “realise.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-4e485457a91e7231.svg",
          "kind": "sequence",
          "altEn": "Confusion changes to understanding when a person sees they had the wrong date.",
          "altJa": "日付を取り違えていたと分かり、混乱が理解に変わる人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "high-utility-verbs"
      },
      "icon": "",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "realize"
      ]
    }
  },
  {
    "id": "word-l30-handle",
    "category": "words",
    "level": 30,
    "before_fields": {
      "title_en": "handle",
      "title_ja": "対処する・扱う",
      "content": {
        "word": "handle",
        "japanese": "対処する・扱う",
        "kanaReading": "ハンドル",
        "pronunciationHint": "Stress HAN; the ending is weak.",
        "exampleSentence": "She handled the complaint calmly.",
        "exampleJapanese": "彼女は苦情に落ち着いて対処しました。",
        "commonMistake": "Handle a problem directly; do not add “with.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "high-utility-verbs"
      },
      "icon": "🛠️",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "handle"
      ]
    },
    "after_fields": {
      "title_en": "handle",
      "title_ja": "対処する・扱う",
      "content": {
        "word": "handle",
        "japanese": "対処する・扱う",
        "kanaReading": "ハンドル",
        "pronunciationHint": "Stress HAN; the ending is weak.",
        "exampleSentence": "She handled the complaint calmly.",
        "exampleJapanese": "彼女は苦情に落ち着いて対処しました。",
        "commonMistake": "Handle a problem directly; do not add “with.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-463472f8355d2079.svg",
          "kind": "sequence",
          "altEn": "A person takes a complaint, works through it, and sorts it out.",
          "altJa": "苦情を聞き、内容を確認して対処する人。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "high-utility-verbs"
      },
      "icon": "",
      "tags": [
        "high-utility-verbs",
        "level-30",
        "handle"
      ]
    }
  },
  {
    "id": "word-l31-efficient",
    "category": "words",
    "level": 31,
    "before_fields": {
      "title_en": "efficient",
      "title_ja": "効率的な",
      "content": {
        "word": "efficient",
        "japanese": "効率的な",
        "kanaReading": "イフィシェント",
        "pronunciationHint": "Stress FI and pronounce ci /ʃ/.",
        "exampleSentence": "This shortcut makes the process more efficient.",
        "exampleJapanese": "この近道で作業がより効率的になります。",
        "commonMistake": "Efficient means using resources well; effective means producing the result.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "precise-adjectives"
      },
      "icon": "⚙️",
      "tags": [
        "precise-adjectives",
        "level-31",
        "efficient"
      ]
    },
    "after_fields": {
      "title_en": "efficient",
      "title_ja": "効率的な",
      "content": {
        "word": "efficient",
        "japanese": "効率的な",
        "kanaReading": "イフィシェント",
        "pronunciationHint": "Stress FI and pronounce ci /ʃ/.",
        "exampleSentence": "This shortcut makes the process more efficient.",
        "exampleJapanese": "この近道で作業がより効率的になります。",
        "commonMistake": "Efficient means using resources well; effective means producing the result.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-df5aca21cd3d640b.svg",
          "kind": "contrast",
          "altEn": "The same finished work takes less time with a better process.",
          "altJa": "同じ作業を、改善したやり方で短い時間に終えます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "precise-adjectives"
      },
      "icon": "",
      "tags": [
        "precise-adjectives",
        "level-31",
        "efficient"
      ]
    }
  },
  {
    "id": "word-l31-flexible",
    "category": "words",
    "level": 31,
    "before_fields": {
      "title_en": "flexible",
      "title_ja": "柔軟な",
      "content": {
        "word": "flexible",
        "japanese": "柔軟な",
        "kanaReading": "フレクシブル",
        "pronunciationHint": "Stress FLEX; later vowels are weak.",
        "exampleSentence": "My work hours are fairly flexible.",
        "exampleJapanese": "私の勤務時間はかなり柔軟です。",
        "commonMistake": "Flexible can describe schedules, materials, or attitudes.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "precise-adjectives"
      },
      "icon": "🤸",
      "tags": [
        "precise-adjectives",
        "level-31",
        "flexible"
      ]
    },
    "after_fields": {
      "title_en": "flexible",
      "title_ja": "柔軟な",
      "content": {
        "word": "flexible",
        "japanese": "柔軟な",
        "kanaReading": "フレクシブル",
        "pronunciationHint": "Stress FLEX; later vowels are weak.",
        "exampleSentence": "My work hours are fairly flexible.",
        "exampleJapanese": "私の勤務時間はかなり柔軟です。",
        "commonMistake": "Flexible can describe schedules, materials, or attitudes.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-2f66397e50c6cd14.svg",
          "kind": "contrast",
          "altEn": "An appointment can move between two available times.",
          "altJa": "予約の時刻を、都合に合わせて柔軟に動かせます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "precise-adjectives"
      },
      "icon": "",
      "tags": [
        "precise-adjectives",
        "level-31",
        "flexible"
      ]
    }
  },
  {
    "id": "word-l31-reliable",
    "category": "words",
    "level": 31,
    "before_fields": {
      "title_en": "reliable",
      "title_ja": "信頼できる",
      "content": {
        "word": "reliable",
        "japanese": "信頼できる",
        "kanaReading": "リライアブル",
        "pronunciationHint": "Stress LI: re-LI-a-ble.",
        "exampleSentence": "We need a reliable internet connection.",
        "exampleJapanese": "安定して信頼できるインターネット接続が必要です。",
        "commonMistake": "Reliable means dependable, not simply accurate.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "precise-adjectives"
      },
      "icon": "🛡️",
      "tags": [
        "precise-adjectives",
        "level-31",
        "reliable"
      ]
    },
    "after_fields": {
      "title_en": "reliable",
      "title_ja": "信頼できる",
      "content": {
        "word": "reliable",
        "japanese": "信頼できる",
        "kanaReading": "リライアブル",
        "pronunciationHint": "Stress LI: re-LI-a-ble.",
        "exampleSentence": "We need a reliable internet connection.",
        "exampleJapanese": "安定して信頼できるインターネット接続が必要です。",
        "commonMistake": "Reliable means dependable, not simply accurate.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-3a03dc123873afda.svg",
          "kind": "scene",
          "altEn": "A bus arrives at its scheduled time on several consecutive days.",
          "altJa": "バスが何日も続けて予定どおりに来て、信頼できることを示します。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "precise-adjectives"
      },
      "icon": "",
      "tags": [
        "precise-adjectives",
        "level-31",
        "reliable"
      ]
    }
  },
  {
    "id": "word-l31-appropriate",
    "category": "words",
    "level": 31,
    "before_fields": {
      "title_en": "appropriate",
      "title_ja": "適切な",
      "content": {
        "word": "appropriate",
        "japanese": "適切な",
        "kanaReading": "アプロウプリエット",
        "pronunciationHint": "As an adjective, stress PRO.",
        "exampleSentence": "Choose language appropriate for the audience.",
        "exampleJapanese": "聞き手に適切な言葉を選んでください。",
        "commonMistake": "Use “appropriate for” a person or purpose; “appropriate to” is also standard in suitable contexts.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "precise-adjectives"
      },
      "icon": "🎯",
      "tags": [
        "precise-adjectives",
        "level-31",
        "appropriate"
      ]
    },
    "after_fields": {
      "title_en": "appropriate",
      "title_ja": "適切な",
      "content": {
        "word": "appropriate",
        "japanese": "適切な",
        "kanaReading": "アプロウプリエット",
        "pronunciationHint": "As an adjective, stress PRO.",
        "exampleSentence": "Choose language appropriate for the audience.",
        "exampleJapanese": "聞き手に適切な言葉を選んでください。",
        "commonMistake": "Use “appropriate for” a person or purpose; “appropriate to” is also standard in suitable contexts.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-737c1637e2591b6a.svg",
          "kind": "contrast",
          "altEn": "A raincoat suits rainy weather better than sunglasses.",
          "altJa": "雨の日に、サングラスよりレインコートが状況に合っています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "precise-adjectives"
      },
      "icon": "",
      "tags": [
        "precise-adjectives",
        "level-31",
        "appropriate"
      ]
    }
  },
  {
    "id": "word-l31-significant",
    "category": "words",
    "level": 31,
    "before_fields": {
      "title_en": "significant",
      "title_ja": "重要な・かなりの",
      "content": {
        "word": "significant",
        "japanese": "重要な・かなりの",
        "kanaReading": "シグニフィカント",
        "pronunciationHint": "Stress NIF.",
        "exampleSentence": "The change produced a significant improvement.",
        "exampleJapanese": "その変更で大きな改善がありました。",
        "commonMistake": "Significant may mean important or statistically meaningful; context matters.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "precise-adjectives"
      },
      "icon": "📌",
      "tags": [
        "precise-adjectives",
        "level-31",
        "significant"
      ]
    },
    "after_fields": {
      "title_en": "significant",
      "title_ja": "重要な・かなりの",
      "content": {
        "word": "significant",
        "japanese": "重要な・かなりの",
        "kanaReading": "シグニフィカント",
        "pronunciationHint": "Stress NIF.",
        "exampleSentence": "The change produced a significant improvement.",
        "exampleJapanese": "その変更で大きな改善がありました。",
        "commonMistake": "Significant may mean important or statistically meaningful; context matters.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-a1dec7fd09931e59.svg",
          "kind": "contrast",
          "altEn": "A chart shows a large meaningful improvement rather than a tiny change.",
          "altJa": "グラフに、小さな変化ではなく大きな改善が表れています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "precise-adjectives"
      },
      "icon": "",
      "tags": [
        "precise-adjectives",
        "level-31",
        "significant"
      ]
    }
  },
  {
    "id": "word-l31-specific",
    "category": "words",
    "level": 31,
    "before_fields": {
      "title_en": "specific",
      "title_ja": "具体的な・特定の",
      "content": {
        "word": "specific",
        "japanese": "具体的な・特定の",
        "kanaReading": "スペシフィック",
        "pronunciationHint": "Stress CIF.",
        "exampleSentence": "Please give one specific example.",
        "exampleJapanese": "具体的な例を1つ挙げてください。",
        "commonMistake": "Specific is more precise than “special.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "precise-adjectives"
      },
      "icon": "🔎",
      "tags": [
        "precise-adjectives",
        "level-31",
        "specific"
      ]
    },
    "after_fields": {
      "title_en": "specific",
      "title_ja": "具体的な・特定の",
      "content": {
        "word": "specific",
        "japanese": "具体的な・特定の",
        "kanaReading": "スペシフィック",
        "pronunciationHint": "Stress CIF.",
        "exampleSentence": "Please give one specific example.",
        "exampleJapanese": "具体的な例を1つ挙げてください。",
        "commonMistake": "Specific is more precise than “special.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-8bb4d1c84f7b96a7.svg",
          "kind": "scene",
          "altEn": "One exact apple is selected from several similar apples.",
          "altJa": "似たりんごが並ぶ中から、特定の一つを指し示しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "precise-adjectives"
      },
      "icon": "",
      "tags": [
        "precise-adjectives",
        "level-31",
        "specific"
      ]
    }
  },
  {
    "id": "word-l31-temporary",
    "category": "words",
    "level": 31,
    "before_fields": {
      "title_en": "temporary",
      "title_ja": "一時的な",
      "content": {
        "word": "temporary",
        "japanese": "一時的な",
        "kanaReading": "テンポラリー",
        "pronunciationHint": "Stress TEM; later vowels are light.",
        "exampleSentence": "This is only a temporary solution.",
        "exampleJapanese": "これは一時的な解決策にすぎません。",
        "commonMistake": "Do not use “temporarily solution”; use adjective “temporary.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "precise-adjectives"
      },
      "icon": "⏱️",
      "tags": [
        "precise-adjectives",
        "level-31",
        "temporary"
      ]
    },
    "after_fields": {
      "title_en": "temporary",
      "title_ja": "一時的な",
      "content": {
        "word": "temporary",
        "japanese": "一時的な",
        "kanaReading": "テンポラリー",
        "pronunciationHint": "Stress TEM; later vowels are light.",
        "exampleSentence": "This is only a temporary solution.",
        "exampleJapanese": "これは一時的な解決策にすぎません。",
        "commonMistake": "Do not use “temporarily solution”; use adjective “temporary.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-fb6999bd47465adf.svg",
          "kind": "scene",
          "altEn": "A sign lasts for a short marked period and is then removed.",
          "altJa": "決まった短い期間だけ掲示され、その後は外される案内。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "precise-adjectives"
      },
      "icon": "",
      "tags": [
        "precise-adjectives",
        "level-31",
        "temporary"
      ]
    }
  },
  {
    "id": "word-l31-permanent",
    "category": "words",
    "level": 31,
    "before_fields": {
      "title_en": "permanent",
      "title_ja": "永久的な",
      "content": {
        "word": "permanent",
        "japanese": "永久的な",
        "kanaReading": "パーマネント",
        "pronunciationHint": "Stress PER; later vowels are weak.",
        "exampleSentence": "The mark is permanent, so use a pencil first.",
        "exampleJapanese": "その印は消えないので、最初は鉛筆を使ってください。",
        "commonMistake": "Permanent contrasts with temporary, not with recent.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "precise-adjectives"
      },
      "icon": "🪨",
      "tags": [
        "precise-adjectives",
        "level-31",
        "permanent"
      ]
    },
    "after_fields": {
      "title_en": "permanent",
      "title_ja": "永久的な",
      "content": {
        "word": "permanent",
        "japanese": "永久的な",
        "kanaReading": "パーマネント",
        "pronunciationHint": "Stress PER; later vowels are weak.",
        "exampleSentence": "The mark is permanent, so use a pencil first.",
        "exampleJapanese": "その印は消えないので、最初は鉛筆を使ってください。",
        "commonMistake": "Permanent contrasts with temporary, not with recent.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-511a913445ad05e7.svg",
          "kind": "scene",
          "altEn": "A permanent ink mark remains after an attempt to erase it.",
          "altJa": "消そうとしても紙に残る、消えないインクの印。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "precise-adjectives"
      },
      "icon": "",
      "tags": [
        "precise-adjectives",
        "level-31",
        "permanent"
      ]
    }
  },
  {
    "id": "word-l31-likely",
    "category": "words",
    "level": 31,
    "before_fields": {
      "title_en": "likely",
      "title_ja": "ありそうな",
      "content": {
        "word": "likely",
        "japanese": "ありそうな",
        "kanaReading": "ライクリー",
        "pronunciationHint": "Stress LIKE; the ending is /li/.",
        "exampleSentence": "Rain is likely this evening.",
        "exampleJapanese": "今晩は雨が降りそうです。",
        "commonMistake": "Say “It is likely that…” or “is likely to…,” not “maybe likely.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "precise-adjectives"
      },
      "icon": "📊",
      "tags": [
        "precise-adjectives",
        "level-31",
        "likely"
      ]
    },
    "after_fields": {
      "title_en": "likely",
      "title_ja": "ありそうな",
      "content": {
        "word": "likely",
        "japanese": "ありそうな",
        "kanaReading": "ライクリー",
        "pronunciationHint": "Stress LIKE; the ending is /li/.",
        "exampleSentence": "We're likely to miss the deadline unless we get more help.",
        "exampleJapanese": "もっと協力を得られなければ、締め切りに間に合いそうにありません。",
        "commonMistake": "Use “be likely to do” or “It is likely that…”; do not say “I likely go” when you mean “I am likely to go.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-17aa03d9aabb08d5.svg",
          "kind": "scene",
          "altEn": "Most of the forecast shows rain, so a person prepares an umbrella.",
          "altJa": "予報の大部分が雨なので、降りそうだと考えて傘を用意します。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "precise-adjectives"
      },
      "icon": "",
      "tags": [
        "precise-adjectives",
        "level-31",
        "likely"
      ]
    }
  },
  {
    "id": "word-l31-unlikely",
    "category": "words",
    "level": 31,
    "before_fields": {
      "title_en": "unlikely",
      "title_ja": "ありそうにない",
      "content": {
        "word": "unlikely",
        "japanese": "ありそうにない",
        "kanaReading": "アンライクリー",
        "pronunciationHint": "Stress LIKE; keep the un prefix light.",
        "exampleSentence": "The shop is unlikely to open today.",
        "exampleJapanese": "その店は今日開かないでしょう。",
        "commonMistake": "“Unlikely” means improbable, not impossible.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "precise-adjectives"
      },
      "icon": "📉",
      "tags": [
        "precise-adjectives",
        "level-31",
        "unlikely"
      ]
    },
    "after_fields": {
      "title_en": "unlikely",
      "title_ja": "ありそうにない",
      "content": {
        "word": "unlikely",
        "japanese": "ありそうにない",
        "kanaReading": "アンライクリー",
        "pronunciationHint": "Stress LIKE; keep the un prefix light.",
        "exampleSentence": "The plan is unlikely to work without a reliable backup.",
        "exampleJapanese": "確実な代替策がなければ、この計画はうまくいきそうにありません。",
        "commonMistake": "“Unlikely” means improbable, not impossible.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-ed0718eb9ed46e2f.svg",
          "kind": "contrast",
          "altEn": "A hot summer day makes snowfall very improbable.",
          "altJa": "暑い夏の日なので、雪が降る可能性はとても低い場面。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "precise-adjectives"
      },
      "icon": "",
      "tags": [
        "precise-adjectives",
        "level-31",
        "unlikely"
      ]
    }
  },
  {
    "id": "word-l32-clarify",
    "category": "words",
    "level": 32,
    "before_fields": {
      "title_en": "clarify",
      "title_ja": "明確にする",
      "content": {
        "word": "clarify",
        "japanese": "明確にする",
        "kanaReading": "クラリファイ",
        "pronunciationHint": "Stress CLAR and finish /faɪ/.",
        "exampleSentence": "Could you clarify what the final step involves?",
        "exampleJapanese": "最後の手順に何が含まれるか明確にしてもらえますか。",
        "commonMistake": "Clarify an idea directly; “clarify about” is usually unnecessary.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "advanced-communication"
      },
      "icon": "🔦",
      "tags": [
        "advanced-communication",
        "level-32",
        "clarify"
      ]
    },
    "after_fields": {
      "title_en": "clarify",
      "title_ja": "明確にする",
      "content": {
        "word": "clarify",
        "japanese": "明確にする",
        "kanaReading": "クラリファイ",
        "pronunciationHint": "Stress CLAR and finish /faɪ/.",
        "exampleSentence": "Could you clarify what the final step involves?",
        "exampleJapanese": "最後の手順に何が含まれるか明確にしてもらえますか。",
        "commonMistake": "Clarify an idea directly; “clarify about” is usually unnecessary.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-c904c492edf82627.svg",
          "kind": "sequence",
          "altEn": "A confusing instruction becomes a clear three-step instruction that a listener understands.",
          "altJa": "曖昧な指示が三つの明確な手順になり、聞き手が理解します。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "advanced-communication"
      },
      "icon": "",
      "tags": [
        "advanced-communication",
        "level-32",
        "clarify"
      ]
    }
  },
  {
    "id": "word-l32-emphasize",
    "category": "words",
    "level": 32,
    "before_fields": {
      "title_en": "emphasize",
      "title_ja": "強調する",
      "content": {
        "word": "emphasize",
        "japanese": "強調する",
        "kanaReading": "エンファサイズ",
        "pronunciationHint": "Stress EM; finish with voiced /z/.",
        "exampleSentence": "The guide emphasizes regular practice.",
        "exampleJapanese": "そのガイドは継続的な練習を強調しています。",
        "commonMistake": "US spelling is “emphasize”; UK also uses “emphasise.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "advanced-communication"
      },
      "icon": "❗",
      "tags": [
        "advanced-communication",
        "level-32",
        "emphasize"
      ]
    },
    "after_fields": {
      "title_en": "emphasize",
      "title_ja": "強調する",
      "content": {
        "word": "emphasize",
        "japanese": "強調する",
        "kanaReading": "エンファサイズ",
        "pronunciationHint": "Stress EM; finish with voiced /z/.",
        "exampleSentence": "The guide emphasizes regular practice.",
        "exampleJapanese": "そのガイドは継続的な練習を強調しています。",
        "commonMistake": "US spelling is “emphasize”; UK also uses “emphasise.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-776e18722ddaa117.svg",
          "kind": "scene",
          "altEn": "One important point is highlighted and underlined while someone points to it.",
          "altJa": "大切な一文に下線と強調の印を付けて示しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "advanced-communication"
      },
      "icon": "",
      "tags": [
        "advanced-communication",
        "level-32",
        "emphasize"
      ]
    }
  },
  {
    "id": "word-l32-persuade",
    "category": "words",
    "level": 32,
    "before_fields": {
      "title_en": "persuade",
      "title_ja": "説得する",
      "content": {
        "word": "persuade",
        "japanese": "説得する",
        "kanaReading": "パースウェイド",
        "pronunciationHint": "Stress SWADE.",
        "exampleSentence": "She persuaded the team to test the idea.",
        "exampleJapanese": "彼女はその案を試すようチームを説得しました。",
        "commonMistake": "Use “persuade someone to do”; “convince” commonly takes “that.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "advanced-communication"
      },
      "icon": "🗣️",
      "tags": [
        "advanced-communication",
        "level-32",
        "persuade"
      ]
    },
    "after_fields": {
      "title_en": "persuade",
      "title_ja": "説得する",
      "content": {
        "word": "persuade",
        "japanese": "説得する",
        "kanaReading": "パースウェイド",
        "pronunciationHint": "Stress SWADE.",
        "exampleSentence": "She persuaded the team to test the idea.",
        "exampleJapanese": "彼女はその案を試すようチームを説得しました。",
        "commonMistake": "Use “persuade someone to do something.” “Convince someone to do something” is also common, especially in US English.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-eedafd666404f718.svg",
          "kind": "sequence",
          "altEn": "A listener changes from unsure to agreeing after hearing reasons.",
          "altJa": "理由を聞いた相手が、迷いから賛成へ考えを変えます。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "advanced-communication"
      },
      "icon": "",
      "tags": [
        "advanced-communication",
        "level-32",
        "persuade"
      ]
    }
  },
  {
    "id": "word-l32-acknowledge",
    "category": "words",
    "level": 32,
    "before_fields": {
      "title_en": "acknowledge",
      "title_ja": "認める・受け取ったと伝える",
      "content": {
        "word": "acknowledge",
        "japanese": "認める・受け取ったと伝える",
        "kanaReading": "アクノリッジ",
        "pronunciationHint": "Stress KNOL; the ending is /ɪdʒ/.",
        "exampleSentence": "He acknowledged the concern before responding.",
        "exampleJapanese": "彼は返答する前に懸念を認めました。",
        "commonMistake": "The initial k is pronounced; the written w is not separately heard.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "advanced-communication"
      },
      "icon": "🙋",
      "tags": [
        "advanced-communication",
        "level-32",
        "acknowledge"
      ]
    },
    "after_fields": {
      "title_en": "acknowledge",
      "title_ja": "認める・受け取ったと伝える",
      "content": {
        "word": "acknowledge",
        "japanese": "認める・受け取ったと伝える",
        "kanaReading": "アクノリッジ",
        "pronunciationHint": "Stress the second syllable /ˈnɒl/ (UK) or /ˈnɑːl/ (US). Finish with /ɪdʒ/.",
        "exampleSentence": "He acknowledged the concern before responding.",
        "exampleJapanese": "彼は返答する前に懸念を認めました。",
        "commonMistake": "The k in “ack” is pronounced, but the written w is silent.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-dab217a1bcb78d7a.svg",
          "kind": "sequence",
          "altEn": "A person receives a message and signals that they have received and understood it.",
          "altJa": "メッセージを受け取り、確かに受け止めたと相手へ示します。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "advanced-communication"
      },
      "icon": "",
      "tags": [
        "advanced-communication",
        "level-32",
        "acknowledge"
      ]
    }
  },
  {
    "id": "word-l32-respond",
    "category": "words",
    "level": 32,
    "before_fields": {
      "title_en": "respond",
      "title_ja": "返答する・反応する",
      "content": {
        "word": "respond",
        "japanese": "返答する・反応する",
        "kanaReading": "リスポンド",
        "pronunciationHint": "Stress SPOND.",
        "exampleSentence": "Please respond by the end of the week.",
        "exampleJapanese": "週末までに返答してください。",
        "commonMistake": "Use “respond to,” not “respond someone.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "advanced-communication"
      },
      "icon": "↪️",
      "tags": [
        "advanced-communication",
        "level-32",
        "respond"
      ]
    },
    "after_fields": {
      "title_en": "respond",
      "title_ja": "返答する・反応する",
      "content": {
        "word": "respond",
        "japanese": "返答する・反応する",
        "kanaReading": "リスポンド",
        "pronunciationHint": "Stress SPOND.",
        "exampleSentence": "How we respond to criticism can be just as important as the work itself.",
        "exampleJapanese": "批判にどう応じるかは、仕事そのものと同じくらい大切なことがあります。",
        "commonMistake": "Use “respond to,” not “respond someone.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-bbd637ec3ba89436.svg",
          "kind": "sequence",
          "altEn": "An incoming message is followed by a reply going back to the sender.",
          "altJa": "届いたメッセージに対して、送り主へ返事を出しています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "advanced-communication"
      },
      "icon": "",
      "tags": [
        "advanced-communication",
        "level-32",
        "respond"
      ]
    }
  },
  {
    "id": "word-l32-contribute",
    "category": "words",
    "level": 32,
    "before_fields": {
      "title_en": "contribute",
      "title_ja": "貢献する・提供する",
      "content": {
        "word": "contribute",
        "japanese": "貢献する・提供する",
        "kanaReading": "コントリビュート",
        "pronunciationHint": "Stress TRIB in common US speech.",
        "exampleSentence": "Everyone contributed one practical idea.",
        "exampleJapanese": "全員が実用的な案を1つずつ出しました。",
        "commonMistake": "Use “contribute to a project,” not “contribute for.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "advanced-communication"
      },
      "icon": "🧱",
      "tags": [
        "advanced-communication",
        "level-32",
        "contribute"
      ]
    },
    "after_fields": {
      "title_en": "contribute",
      "title_ja": "貢献する・提供する",
      "content": {
        "word": "contribute",
        "japanese": "貢献する・提供する",
        "kanaReading": "コントリビュート",
        "pronunciationHint": "Stress TRIB in common US speech.",
        "exampleSentence": "Everyone contributed one practical idea.",
        "exampleJapanese": "全員が実用的な案を1つずつ出しました。",
        "commonMistake": "Use “contribute to a project,” not “contribute for.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-849c1b6b426eedb3.svg",
          "kind": "sequence",
          "altEn": "Each person adds one piece to a shared result.",
          "altJa": "一人ひとりが一つずつ加え、共同の成果に貢献します。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "advanced-communication"
      },
      "icon": "",
      "tags": [
        "advanced-communication",
        "level-32",
        "contribute"
      ]
    }
  },
  {
    "id": "word-l32-collaborate",
    "category": "words",
    "level": 32,
    "before_fields": {
      "title_en": "collaborate",
      "title_ja": "協力する",
      "content": {
        "word": "collaborate",
        "japanese": "協力する",
        "kanaReading": "コラボレイト",
        "pronunciationHint": "Stress LAB.",
        "exampleSentence": "The two classes collaborated on a video.",
        "exampleJapanese": "2つのクラスが動画制作で協力しました。",
        "commonMistake": "Use “collaborate with people on a project.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "advanced-communication"
      },
      "icon": "🤝",
      "tags": [
        "advanced-communication",
        "level-32",
        "collaborate"
      ]
    },
    "after_fields": {
      "title_en": "collaborate",
      "title_ja": "協力する",
      "content": {
        "word": "collaborate",
        "japanese": "協力する",
        "kanaReading": "コラボレイト",
        "pronunciationHint": "Stress LAB.",
        "exampleSentence": "The two classes collaborated on a video.",
        "exampleJapanese": "2つのクラスが動画制作で協力しました。",
        "commonMistake": "Use “collaborate with people on a project.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-719866561fa2a254.svg",
          "kind": "scene",
          "altEn": "People work together on different parts of one shared creation.",
          "altJa": "一つの制作物に向けて、役割を分けながら協力する人たち。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "advanced-communication"
      },
      "icon": "",
      "tags": [
        "advanced-communication",
        "level-32",
        "collaborate"
      ]
    }
  },
  {
    "id": "word-l32-resolve",
    "category": "words",
    "level": 32,
    "before_fields": {
      "title_en": "resolve",
      "title_ja": "解決する・決意する",
      "content": {
        "word": "resolve",
        "japanese": "解決する・決意する",
        "kanaReading": "リゾルヴ",
        "pronunciationHint": "Stress SOLVE and finish with voiced v.",
        "exampleSentence": "We resolved the issue without delaying the launch.",
        "exampleJapanese": "開始を遅らせずに問題を解決しました。",
        "commonMistake": "Resolve suggests a definite solution; it is stronger than discuss.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "advanced-communication"
      },
      "icon": "🧩",
      "tags": [
        "advanced-communication",
        "level-32",
        "resolve"
      ]
    },
    "after_fields": {
      "title_en": "resolve",
      "title_ja": "解決する・決意する",
      "content": {
        "word": "resolve",
        "japanese": "解決する・決意する",
        "kanaReading": "リゾルヴ",
        "pronunciationHint": "Stress SOLVE and finish with voiced v.",
        "exampleSentence": "We resolved the issue without delaying the launch.",
        "exampleJapanese": "開始を遅らせずに問題を解決しました。",
        "commonMistake": "Resolve suggests a definite solution; it is stronger than discuss.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-a4267673c931fcb3.svg",
          "kind": "sequence",
          "altEn": "A missing solution is found and people reach a settled agreement.",
          "altJa": "解決に必要なものが見つかり、互いに納得して合意します。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "advanced-communication"
      },
      "icon": "",
      "tags": [
        "advanced-communication",
        "level-32",
        "resolve"
      ]
    }
  },
  {
    "id": "word-l32-reflect",
    "category": "words",
    "level": 32,
    "before_fields": {
      "title_en": "reflect",
      "title_ja": "振り返る・反映する",
      "content": {
        "word": "reflect",
        "japanese": "振り返る・反映する",
        "kanaReading": "リフレクト",
        "pronunciationHint": "Stress FLECT.",
        "exampleSentence": "Take a minute to reflect on what you learned.",
        "exampleJapanese": "学んだことを1分間振り返ってください。",
        "commonMistake": "Use “reflect on” when thinking carefully about something.",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "advanced-communication"
      },
      "icon": "🪞",
      "tags": [
        "advanced-communication",
        "level-32",
        "reflect"
      ]
    },
    "after_fields": {
      "title_en": "reflect",
      "title_ja": "振り返る・反映する",
      "content": {
        "word": "reflect",
        "japanese": "振り返る・反映する",
        "kanaReading": "リフレクト",
        "pronunciationHint": "Stress FLECT.",
        "exampleSentence": "Take a minute to reflect on what you learned.",
        "exampleJapanese": "学んだことを1分間振り返ってください。",
        "commonMistake": "Use “reflect on” when thinking carefully about something.",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-21edb2f504ef9a2f.svg",
          "kind": "sequence",
          "altEn": "A person looks back at a past experience and writes down what they learned.",
          "altJa": "過去の体験を振り返り、学んだことを書き留めています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "advanced-communication"
      },
      "icon": "",
      "tags": [
        "advanced-communication",
        "level-32",
        "reflect"
      ]
    }
  },
  {
    "id": "word-l32-adapt",
    "category": "words",
    "level": 32,
    "before_fields": {
      "title_en": "adapt",
      "title_ja": "適応する・調整する",
      "content": {
        "word": "adapt",
        "japanese": "適応する・調整する",
        "kanaReading": "アダプト",
        "pronunciationHint": "Stress DAPT.",
        "exampleSentence": "Good teachers adapt activities to each learner.",
        "exampleJapanese": "良い先生は生徒一人ひとりに活動を合わせます。",
        "commonMistake": "Use “adapt to a situation” and “adapt something for a purpose.”",
        "imageType": "emoji",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "topic": "advanced-communication"
      },
      "icon": "🌱",
      "tags": [
        "advanced-communication",
        "level-32",
        "adapt"
      ]
    },
    "after_fields": {
      "title_en": "adapt",
      "title_ja": "適応する・調整する",
      "content": {
        "word": "adapt",
        "japanese": "適応する・調整する",
        "kanaReading": "アダプト",
        "pronunciationHint": "Stress DAPT.",
        "exampleSentence": "Good teachers adapt activities to each learner.",
        "exampleJapanese": "良い先生は生徒一人ひとりに活動を合わせます。",
        "commonMistake": "Use “adapt to a situation” and “adapt something for a purpose.”",
        "imageType": "licensed-illustration",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "visual": {
          "src": "/assets/curriculum/words-b1b459caff754b82.svg",
          "kind": "sequence",
          "altEn": "A spoon is changed to suit a learner’s needs, making it easier to use.",
          "altJa": "使う人に合うようスプーンを調整し、使いやすくしています。",
          "sceneEn": "",
          "sceneJa": ""
        },
        "topic": "advanced-communication"
      },
      "icon": "",
      "tags": [
        "advanced-communication",
        "level-32",
        "adapt"
      ]
    }
  },
  {
    "id": "phrase-l01-01",
    "category": "phrases",
    "level": 1,
    "before_fields": {
      "title_en": "Hi, I'm Ren.",
      "title_ja": "こんにちは、レンです。",
      "content": {
        "phrase": "Hi, I'm Ren.",
        "japanese": "こんにちは、レンです。",
        "situation": "初めて会った人に名前を伝えるとき",
        "naturalUsage": "Hi のあとに名前を続ける、短く親しみやすい自己紹介です。",
        "exampleDialogue": "A: Hi, I'm Ren. B: Hi, Ren! I'm Mia.",
        "commonMistake": "I Ren. ではなく、be動詞を入れて I'm Ren. と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "greeting",
        "introduction",
        "beginner"
      ]
    },
    "after_fields": {
      "title_en": "Hi, I'm Ren.",
      "title_ja": "こんにちは、レンです。",
      "content": {
        "phrase": "Hi, I'm Ren.",
        "japanese": "こんにちは、レンです。",
        "situation": "初めて会った人に名前を伝えるとき",
        "naturalUsage": "Hi のあとに名前を続ける、短く親しみやすい自己紹介です。",
        "exampleDialogue": "A: Hi, I'm Ren. B: Hi, Ren! I'm Mia.",
        "commonMistake": "I Ren. ではなく、be動詞を入れて I'm Ren. と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-303c0f3f087ef275.svg",
          "kind": "scene",
          "altEn": "A learner waves hello and writes Ren on a name card.",
          "altJa": "初めての英語クラブ。初めて会った人に名前を伝える場面。",
          "sceneEn": "First day at the club",
          "sceneJa": "初めての英語クラブ"
        }
      },
      "icon": "",
      "tags": [
        "greeting",
        "introduction",
        "beginner"
      ]
    }
  },
  {
    "id": "phrase-l01-02",
    "category": "phrases",
    "level": 1,
    "before_fields": {
      "title_en": "Nice to meet you.",
      "title_ja": "はじめまして。",
      "content": {
        "phrase": "Nice to meet you.",
        "japanese": "はじめまして。",
        "situation": "初対面のあいさつをするとき",
        "naturalUsage": "自己紹介の直後に使う定番のあいさつです。",
        "exampleDialogue": "A: I'm Yui. Nice to meet you. B: Nice to meet you, too.",
        "commonMistake": "初対面では Nice to see you. より Nice to meet you. が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "greeting",
        "introduction",
        "polite"
      ]
    },
    "after_fields": {
      "title_en": "Nice to meet you.",
      "title_ja": "はじめまして。",
      "content": {
        "phrase": "Nice to meet you.",
        "japanese": "はじめまして。",
        "situation": "初対面のあいさつをするとき",
        "naturalUsage": "自己紹介の直後に使う定番のあいさつです。",
        "exampleDialogue": "A: I'm Yui. Nice to meet you. B: Nice to meet you, too.",
        "commonMistake": "初対面では Nice to see you. より Nice to meet you. が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-aa845e4008a33bc9.svg",
          "kind": "scene",
          "altEn": "Two people shake hands beside a school bag as they meet for the first time.",
          "altJa": "新しいクラスメートと対面。初対面のあいさつをする場面。",
          "sceneEn": "Meeting a new classmate",
          "sceneJa": "新しいクラスメートと対面"
        }
      },
      "icon": "",
      "tags": [
        "greeting",
        "introduction",
        "polite"
      ]
    }
  },
  {
    "id": "phrase-l01-03",
    "category": "phrases",
    "level": 1,
    "before_fields": {
      "title_en": "I'm hungry.",
      "title_ja": "おなかがすきました。",
      "content": {
        "phrase": "I'm hungry.",
        "japanese": "おなかがすきました。",
        "situation": "食べたい気持ちを伝えるとき",
        "naturalUsage": "家族や友達に今の状態を短く伝えられます。",
        "exampleDialogue": "A: I'm hungry. B: Let's have a snack.",
        "commonMistake": "I hungry. ではなく、I'm hungry. と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "feelings",
        "food",
        "beginner"
      ]
    },
    "after_fields": {
      "title_en": "I'm hungry.",
      "title_ja": "おなかがすきました。",
      "content": {
        "phrase": "I'm hungry.",
        "japanese": "おなかがすきました。",
        "situation": "食べたい気持ちを伝えるとき",
        "naturalUsage": "家族や友達に今の状態を短く伝えられます。",
        "exampleDialogue": "A: I'm hungry. B: Let's have a snack.",
        "commonMistake": "I hungry. ではなく、I'm hungry. と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-49c53969d38eb1be.svg",
          "kind": "sequence",
          "altEn": "A hungry learner looks forward to a sandwich on an empty plate.",
          "altJa": "昼食前。食べたい気持ちを伝える場面。",
          "sceneEn": "Before lunch",
          "sceneJa": "昼食前"
        }
      },
      "icon": "",
      "tags": [
        "feelings",
        "food",
        "beginner"
      ]
    }
  },
  {
    "id": "phrase-l01-04",
    "category": "phrases",
    "level": 1,
    "before_fields": {
      "title_en": "Thank you.",
      "title_ja": "ありがとう。",
      "content": {
        "phrase": "Thank you.",
        "japanese": "ありがとう。",
        "situation": "何かをしてもらったとき",
        "naturalUsage": "小さな親切にも使える、最も基本的なお礼です。",
        "exampleDialogue": "A: Here is your pencil. B: Thank you.",
        "commonMistake": "Thank. だけで終わらず、Thank you. と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "thanks",
        "manners",
        "beginner"
      ]
    },
    "after_fields": {
      "title_en": "Thank you.",
      "title_ja": "ありがとう。",
      "content": {
        "phrase": "Thank you.",
        "japanese": "ありがとう。",
        "situation": "何かをしてもらったとき",
        "naturalUsage": "小さな親切にも使える、最も基本的なお礼です。",
        "exampleDialogue": "A: Here is your pencil. B: Thank you.",
        "commonMistake": "Thank. だけで終わらず、Thank you. と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-5000e80775f7868d.svg",
          "kind": "scene",
          "altEn": "One person gives a wrapped present and the recipient smiles appreciatively.",
          "altJa": "プレゼントを受け取って。何かをしてもらった場面。",
          "sceneEn": "Receiving a thoughtful gift",
          "sceneJa": "プレゼントを受け取って"
        }
      },
      "icon": "",
      "tags": [
        "thanks",
        "manners",
        "beginner"
      ]
    }
  },
  {
    "id": "phrase-l02-01",
    "category": "phrases",
    "level": 2,
    "before_fields": {
      "title_en": "Can I try?",
      "title_ja": "やってみてもいい？",
      "content": {
        "phrase": "Can I try?",
        "japanese": "やってみてもいい？",
        "situation": "活動やゲームに挑戦したいとき",
        "naturalUsage": "先生や友達に許可を求める、短く自然な表現です。",
        "exampleDialogue": "A: Who wants to go first? B: Can I try?",
        "commonMistake": "Can I trying? ではなく、Can I のあとには try の原形を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "permission",
        "classroom",
        "action"
      ]
    },
    "after_fields": {
      "title_en": "Can I try?",
      "title_ja": "やってみてもいい？",
      "content": {
        "phrase": "Can I try?",
        "japanese": "やってみてもいい？",
        "situation": "活動やゲームに挑戦したいとき",
        "naturalUsage": "先生や友達に許可を求める、短く自然な表現です。",
        "exampleDialogue": "A: Who wants to go first? B: Can I try?",
        "commonMistake": "Can I trying? ではなく、Can I のあとには try の原形を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-87ffb9cbd115dfc1.svg",
          "kind": "scene",
          "altEn": "A learner asks for a turn with a shape puzzle before beginning.",
          "altJa": "新しいゲームに挑戦。活動やゲームに挑戦したい場面。",
          "sceneEn": "Trying a new game",
          "sceneJa": "新しいゲームに挑戦"
        }
      },
      "icon": "",
      "tags": [
        "permission",
        "classroom",
        "action"
      ]
    }
  },
  {
    "id": "phrase-l02-02",
    "category": "phrases",
    "level": 2,
    "before_fields": {
      "title_en": "Please help me.",
      "title_ja": "手伝ってください。",
      "content": {
        "phrase": "Please help me.",
        "japanese": "手伝ってください。",
        "situation": "一人では難しくて助けが必要なとき",
        "naturalUsage": "困っていることをはっきり、丁寧に伝えられます。",
        "exampleDialogue": "A: Please help me. B: Sure. What do you need?",
        "commonMistake": "Help me please. も通じますが、Please help me. は初級者にも使いやすい形です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "help",
        "request",
        "classroom"
      ]
    },
    "after_fields": {
      "title_en": "Please help me.",
      "title_ja": "手伝ってください。",
      "content": {
        "phrase": "Please help me.",
        "japanese": "手伝ってください。",
        "situation": "一人では難しくて助けが必要なとき",
        "naturalUsage": "困っていることをはっきり、丁寧に伝えられます。",
        "exampleDialogue": "A: Please help me. B: Sure. What do you need?",
        "commonMistake": "Please help me. と Help me, please. はどちらも自然です。困っていることを穏やかな声で伝えましょう。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-c08f90e83f3deda4.svg",
          "kind": "scene",
          "altEn": "A person carrying a stack of books asks for help reaching the bookcase.",
          "altJa": "荷物を一緒に運ぶ。一人では難しくて助けが必要な場面。",
          "sceneEn": "Carrying something together",
          "sceneJa": "荷物を一緒に運ぶ"
        }
      },
      "icon": "",
      "tags": [
        "help",
        "request",
        "classroom"
      ]
    }
  },
  {
    "id": "phrase-l02-03",
    "category": "phrases",
    "level": 2,
    "before_fields": {
      "title_en": "I don't know.",
      "title_ja": "分かりません。",
      "content": {
        "phrase": "I don't know.",
        "japanese": "分かりません。",
        "situation": "答えや情報が分からないとき",
        "naturalUsage": "無理に答えず、分からないことを率直に伝える表現です。",
        "exampleDialogue": "A: Where is Ken? B: I don't know.",
        "commonMistake": "I no know. ではなく、don't を使って I don't know. と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "classroom",
        "knowledge",
        "beginner"
      ]
    },
    "after_fields": {
      "title_en": "I don't know.",
      "title_ja": "分かりません。",
      "content": {
        "phrase": "I don't know.",
        "japanese": "分かりません。",
        "situation": "答えや情報が分からないとき",
        "naturalUsage": "無理に答えず、分からないことを率直に伝える表現です。",
        "exampleDialogue": "A: Where is Ken? B: I don't know.",
        "commonMistake": "I no know. ではなく、don't を使って I don't know. と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-d7c288d80de84edb.svg",
          "kind": "scene",
          "altEn": "A learner pauses over an unfamiliar worksheet question with a puzzled expression.",
          "altJa": "分からない質問。答えや情報が分からない場面。",
          "sceneEn": "An unfamiliar question",
          "sceneJa": "分からない質問"
        }
      },
      "icon": "",
      "tags": [
        "classroom",
        "knowledge",
        "beginner"
      ]
    }
  },
  {
    "id": "phrase-l02-04",
    "category": "phrases",
    "level": 2,
    "before_fields": {
      "title_en": "One more time, please.",
      "title_ja": "もう一度お願いします。",
      "content": {
        "phrase": "One more time, please.",
        "japanese": "もう一度お願いします。",
        "situation": "聞き取れなかった内容を繰り返してほしいとき",
        "naturalUsage": "授業でも日常会話でも使える簡単な聞き返しです。",
        "exampleDialogue": "A: Open to page twelve. B: One more time, please.",
        "commonMistake": "Once more time とは言わず、One more time と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "clarification",
        "classroom",
        "listening"
      ]
    },
    "after_fields": {
      "title_en": "One more time, please.",
      "title_ja": "もう一度お願いします。",
      "content": {
        "phrase": "One more time, please.",
        "japanese": "もう一度お願いします。",
        "situation": "聞き取れなかった内容を繰り返してほしいとき",
        "naturalUsage": "授業でも日常会話でも使える簡単な聞き返しです。",
        "exampleDialogue": "A: Open to page twelve. B: One more time, please.",
        "commonMistake": "Once more time とは言わず、One more time と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-218fb7cf46bcf94c.svg",
          "kind": "sequence",
          "altEn": "A spoken instruction is heard, rewound, and repeated more slowly.",
          "altJa": "口頭の説明を練習。聞き取れなかった内容を繰り返してほしい場面。",
          "sceneEn": "Practising a spoken instruction",
          "sceneJa": "口頭の説明を練習"
        }
      },
      "icon": "",
      "tags": [
        "clarification",
        "classroom",
        "listening"
      ]
    }
  },
  {
    "id": "phrase-l03-01",
    "category": "phrases",
    "level": 3,
    "before_fields": {
      "title_en": "I like this one.",
      "title_ja": "私はこれが好きです。",
      "content": {
        "phrase": "I like this one.",
        "japanese": "私はこれが好きです。",
        "situation": "いくつかの中から好みを伝えるとき",
        "naturalUsage": "物を指しながら this one と言うと自然です。",
        "exampleDialogue": "A: Which bag do you like? B: I like this one.",
        "commonMistake": "I like this it. のように one と it を重ねません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "preference",
        "choice",
        "daily-life"
      ]
    },
    "after_fields": {
      "title_en": "I like this one.",
      "title_ja": "私はこれが好きです。",
      "content": {
        "phrase": "I like this one.",
        "japanese": "私はこれが好きです。",
        "situation": "いくつかの中から好みを伝えるとき",
        "naturalUsage": "物を指しながら this one と言うと自然です。",
        "exampleDialogue": "A: Which bag do you like? B: I like this one.",
        "commonMistake": "this one は一つの物を指します。I like this one it. のように one と it を重ねません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-a7c90678ff1a5782.svg",
          "kind": "contrast",
          "altEn": "Two different fruit snacks are compared and one is marked as the preferred choice.",
          "altJa": "おやつを選ぶ。いくつかの中から好みを伝える場面。",
          "sceneEn": "Choosing a snack",
          "sceneJa": "おやつを選ぶ"
        }
      },
      "icon": "",
      "tags": [
        "preference",
        "choice",
        "daily-life"
      ]
    }
  },
  {
    "id": "phrase-l03-02",
    "category": "phrases",
    "level": 3,
    "before_fields": {
      "title_en": "That's my favorite.",
      "title_ja": "それが一番好きです。",
      "content": {
        "phrase": "That's my favorite.",
        "japanese": "それが一番好きです。",
        "situation": "特に好きなものを伝えるとき",
        "naturalUsage": "食べ物、色、曲など幅広い話題に使えます。",
        "exampleDialogue": "A: Do you like strawberry ice cream? B: Yes! That's my favorite.",
        "commonMistake": "my favorite のあとに名詞がなくても、話題が明らかなら自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "preference",
        "favorite",
        "conversation"
      ]
    },
    "after_fields": {
      "title_en": "That's my favorite.",
      "title_ja": "それが一番好きです。",
      "content": {
        "phrase": "That's my favorite.",
        "japanese": "それが一番好きです。",
        "situation": "特に好きなものを伝えるとき",
        "naturalUsage": "食べ物、色、曲など幅広い話題に使えます。",
        "exampleDialogue": "A: Do you like strawberry ice cream? B: Yes! That's my favorite.",
        "commonMistake": "my favorite のあとに名詞がなくても、話題が明らかなら自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-855c7b1e4f02bbf1.svg",
          "kind": "scene",
          "altEn": "A football and a favourite marker show the activity someone most enjoys playing.",
          "altJa": "大好きな遊び。特に好きなものを伝える場面。",
          "sceneEn": "A favourite activity",
          "sceneJa": "大好きな遊び"
        }
      },
      "icon": "",
      "tags": [
        "preference",
        "favorite",
        "conversation"
      ]
    }
  },
  {
    "id": "phrase-l03-03",
    "category": "phrases",
    "level": 3,
    "before_fields": {
      "title_en": "I don't like it very much.",
      "title_ja": "それはあまり好きではありません。",
      "content": {
        "phrase": "I don't like it very much.",
        "japanese": "それはあまり好きではありません。",
        "situation": "好みではないことをやわらかく伝えるとき",
        "naturalUsage": "I hate it. より穏やかで、相手を傷つけにくい言い方です。",
        "exampleDialogue": "A: Do you like spicy food? B: I don't like it very much.",
        "commonMistake": "not very much は好きな程度が低いという意味で、語順を崩さないようにします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "preference",
        "softening",
        "food"
      ]
    },
    "after_fields": {
      "title_en": "I don't like it very much.",
      "title_ja": "それはあまり好きではありません。",
      "content": {
        "phrase": "I don't like it very much.",
        "japanese": "それはあまり好きではありません。",
        "situation": "好みではないことをやわらかく伝えるとき",
        "naturalUsage": "I hate it. より穏やかで、相手を傷つけにくい言い方です。",
        "exampleDialogue": "A: Do you like spicy food? B: I don't like it very much.",
        "commonMistake": "not very much は好きな程度が低いという意味で、語順を崩さないようにします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-bccc4ef1ef3c780a.svg",
          "kind": "contrast",
          "altEn": "A diner tries olives, looks uncertain, and considers a different plate of food.",
          "altJa": "食べ物の好みをやわらかく伝える。好みではないことをやわらかく伝える場面。",
          "sceneEn": "A gentle food preference",
          "sceneJa": "食べ物の好みをやわらかく伝える"
        }
      },
      "icon": "",
      "tags": [
        "preference",
        "softening",
        "food"
      ]
    }
  },
  {
    "id": "phrase-l03-04",
    "category": "phrases",
    "level": 3,
    "before_fields": {
      "title_en": "Which one do you want?",
      "title_ja": "どれがほしいですか？",
      "content": {
        "phrase": "Which one do you want?",
        "japanese": "どれがほしいですか？",
        "situation": "相手に選んでもらうとき",
        "naturalUsage": "目の前に複数の選択肢がある場面で使います。",
        "exampleDialogue": "A: Which one do you want? B: The blue one, please.",
        "commonMistake": "Which do you want one? ではなく、Which one をひとまとまりで使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "choice",
        "question",
        "shopping"
      ]
    },
    "after_fields": {
      "title_en": "Which one do you want?",
      "title_ja": "どれがほしいですか？",
      "content": {
        "phrase": "Which one do you want?",
        "japanese": "どれがほしいですか？",
        "situation": "相手に選んでもらうとき",
        "naturalUsage": "目の前に複数の選択肢がある場面で使います。",
        "exampleDialogue": "A: Which one do you want? B: The blue one, please.",
        "commonMistake": "Which do you want one? ではなく、Which one をひとまとまりで使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-605b1f0ad6e739ec.svg",
          "kind": "contrast",
          "altEn": "Two different tops are offered while the customer is invited to choose.",
          "altJa": "二つの選択肢を差し出す。相手に選んでもらう場面。",
          "sceneEn": "Offering two choices",
          "sceneJa": "二つの選択肢を差し出す"
        }
      },
      "icon": "",
      "tags": [
        "choice",
        "question",
        "shopping"
      ]
    }
  },
  {
    "id": "phrase-l04-01",
    "category": "phrases",
    "level": 4,
    "before_fields": {
      "title_en": "This is my brother.",
      "title_ja": "こちらは私の兄（弟）です。",
      "content": {
        "phrase": "This is my brother.",
        "japanese": "こちらは私の兄（弟）です。",
        "situation": "家族を人に紹介するとき",
        "naturalUsage": "そばにいる人を紹介するときは This is ... を使います。",
        "exampleDialogue": "A: This is my brother, Kai. B: Hi, Kai.",
        "commonMistake": "日本語の兄・弟の区別が必要なら older brother / younger brother を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "family",
        "introduction",
        "people"
      ]
    },
    "after_fields": {
      "title_en": "This is my brother.",
      "title_ja": "こちらは私の兄（弟）です。",
      "content": {
        "phrase": "This is my brother.",
        "japanese": "こちらは私の兄（弟）です。",
        "situation": "家族を人に紹介するとき",
        "naturalUsage": "そばにいる人を紹介するときは This is ... を使います。",
        "exampleDialogue": "A: This is my brother, Kai. B: Hi, Kai.",
        "commonMistake": "日本語の兄・弟の区別が必要なら older brother / younger brother を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-399485f076a1113c.svg",
          "kind": "scene",
          "altEn": "A learner introduces their brother to a visitor at home.",
          "altJa": "家族を紹介。家族を人に紹介する場面。",
          "sceneEn": "Introducing family",
          "sceneJa": "家族を紹介"
        }
      },
      "icon": "",
      "tags": [
        "family",
        "introduction",
        "people"
      ]
    }
  },
  {
    "id": "phrase-l04-02",
    "category": "phrases",
    "level": 4,
    "before_fields": {
      "title_en": "I'm home!",
      "title_ja": "ただいま！",
      "content": {
        "phrase": "I'm home!",
        "japanese": "ただいま！",
        "situation": "家に帰ってきたことを知らせるとき",
        "naturalUsage": "英語には「ただいま」と完全に同じ決まり文句がないため、帰宅を伝える自然な言い方です。",
        "exampleDialogue": "A: I'm home! B: Welcome back.",
        "commonMistake": "I came home. は帰宅した事実の説明で、玄関での一言には I'm home! が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "home",
        "family",
        "greeting"
      ]
    },
    "after_fields": {
      "title_en": "I'm home!",
      "title_ja": "ただいま！",
      "content": {
        "phrase": "I'm home!",
        "japanese": "ただいま！",
        "situation": "家に帰ってきたことを知らせるとき",
        "naturalUsage": "英語には「ただいま」と完全に同じ決まり文句がないため、帰宅を伝える自然な言い方です。",
        "exampleDialogue": "A: I'm home! B: Welcome back.",
        "commonMistake": "I came home. は帰宅した事実の説明で、玄関での一言には I'm home! が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-111ec67a8472ecb3.svg",
          "kind": "sequence",
          "altEn": "A returning learner comes through the front door and calls a greeting.",
          "altJa": "帰宅したところ。家に帰ってきたことを知らせる場面。",
          "sceneEn": "Arriving home",
          "sceneJa": "帰宅したところ"
        }
      },
      "icon": "",
      "tags": [
        "home",
        "family",
        "greeting"
      ]
    }
  },
  {
    "id": "phrase-l04-03",
    "category": "phrases",
    "level": 4,
    "before_fields": {
      "title_en": "Where's my backpack?",
      "title_ja": "私のリュックはどこ？",
      "content": {
        "phrase": "Where's my backpack?",
        "japanese": "私のリュックはどこ？",
        "situation": "持ち物が見つからないとき",
        "naturalUsage": "家や学校で物の場所を尋ねる日常的な表現です。",
        "exampleDialogue": "A: Where's my backpack? B: It's by the door.",
        "commonMistake": "Where my backpack? ではなく、Where's を入れます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "home",
        "location",
        "belongings"
      ]
    },
    "after_fields": {
      "title_en": "Where's my backpack?",
      "title_ja": "私のリュックはどこ？",
      "content": {
        "phrase": "Where's my backpack?",
        "japanese": "私のリュックはどこ？",
        "situation": "持ち物が見つからないとき",
        "naturalUsage": "家や学校で物の場所を尋ねる日常的な表現です。",
        "exampleDialogue": "A: Where's my backpack? B: It's by the door.",
        "commonMistake": "Where my backpack? ではなく、Where's を入れます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-3d454b243b19cdf0.svg",
          "kind": "scene",
          "altEn": "A school bag is being searched for around a chair at home.",
          "altJa": "通学バッグを探す。持ち物が見つからない場面。",
          "sceneEn": "Looking for a school bag",
          "sceneJa": "通学バッグを探す"
        }
      },
      "icon": "",
      "tags": [
        "home",
        "location",
        "belongings"
      ]
    }
  },
  {
    "id": "phrase-l04-04",
    "category": "phrases",
    "level": 4,
    "before_fields": {
      "title_en": "Let's clean up.",
      "title_ja": "片づけよう。",
      "content": {
        "phrase": "Let's clean up.",
        "japanese": "片づけよう。",
        "situation": "一緒に片づけを始めるとき",
        "naturalUsage": "遊びや作業のあとに、みんなへ明るく呼びかける表現です。",
        "exampleDialogue": "A: Dinner is almost ready. B: Okay, let's clean up.",
        "commonMistake": "Let's のあとには cleaning ではなく clean の原形を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "home",
        "suggestion",
        "chores"
      ]
    },
    "after_fields": {
      "title_en": "Let's clean up.",
      "title_ja": "片づけよう。",
      "content": {
        "phrase": "Let's clean up.",
        "japanese": "片づけよう。",
        "situation": "一緒に片づけを始めるとき",
        "naturalUsage": "遊びや作業のあとに、みんなへ明るく呼びかける表現です。",
        "exampleDialogue": "A: Dinner is almost ready. B: Okay, let's clean up.",
        "commonMistake": "Let's のあとには cleaning ではなく clean の原形を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-8080f98d2e398b5d.svg",
          "kind": "sequence",
          "altEn": "Scattered play materials are tidied away so a shared room becomes clear.",
          "altJa": "部屋を一緒に片づける。一緒に片づけを始める場面。",
          "sceneEn": "Tidying a shared room",
          "sceneJa": "部屋を一緒に片づける"
        }
      },
      "icon": "",
      "tags": [
        "home",
        "suggestion",
        "chores"
      ]
    }
  },
  {
    "id": "phrase-l05-01",
    "category": "phrases",
    "level": 5,
    "before_fields": {
      "title_en": "What time is it?",
      "title_ja": "何時ですか？",
      "content": {
        "phrase": "What time is it?",
        "japanese": "何時ですか？",
        "situation": "現在の時刻を知りたいとき",
        "naturalUsage": "時計が見えないときや予定を確認するときに使います。",
        "exampleDialogue": "A: What time is it? B: It's seven thirty.",
        "commonMistake": "What time it is? ではなく、疑問文では is it の順にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "time",
        "question",
        "daily-routine"
      ]
    },
    "after_fields": {
      "title_en": "What time is it?",
      "title_ja": "何時ですか？",
      "content": {
        "phrase": "What time is it?",
        "japanese": "何時ですか？",
        "situation": "現在の時刻を知りたいとき",
        "naturalUsage": "時計が見えないときや予定を確認するときに使います。",
        "exampleDialogue": "A: What time is it? B: It's seven thirty.",
        "commonMistake": "What time it is? ではなく、疑問文では is it の順にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-e4fc1bc854f87927.svg",
          "kind": "scene",
          "altEn": "A learner checks a wall clock before class begins.",
          "altJa": "時刻を確認。現在の時刻を知りたい場面。",
          "sceneEn": "Checking the time",
          "sceneJa": "時刻を確認"
        }
      },
      "icon": "",
      "tags": [
        "time",
        "question",
        "daily-routine"
      ]
    }
  },
  {
    "id": "phrase-l05-02",
    "category": "phrases",
    "level": 5,
    "before_fields": {
      "title_en": "I'm getting ready.",
      "title_ja": "今、準備しています。",
      "content": {
        "phrase": "I'm getting ready.",
        "japanese": "今、準備しています。",
        "situation": "出発などの準備中だと伝えるとき",
        "naturalUsage": "まさに準備を進めている最中に使う表現です。",
        "exampleDialogue": "A: Are you ready for school? B: I'm getting ready.",
        "commonMistake": "I'm preparing. も可能ですが、身支度には getting ready が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "routine",
        "present-progressive",
        "home"
      ]
    },
    "after_fields": {
      "title_en": "I'm getting ready.",
      "title_ja": "今、準備しています。",
      "content": {
        "phrase": "I'm getting ready.",
        "japanese": "今、準備しています。",
        "situation": "出発などの準備中だと伝えるとき",
        "naturalUsage": "まさに準備を進めている最中に使う表現です。",
        "exampleDialogue": "A: Are you ready for school? B: I'm getting ready.",
        "commonMistake": "I'm preparing. も可能ですが、身支度には getting ready が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-ef429f6ec77b4613.svg",
          "kind": "sequence",
          "altEn": "A learner gets dressed, prepares a school bag, and is nearly ready to go.",
          "altJa": "出発の準備。出発などの準備中だと伝える場面。",
          "sceneEn": "Getting ready to leave",
          "sceneJa": "出発の準備"
        }
      },
      "icon": "",
      "tags": [
        "routine",
        "present-progressive",
        "home"
      ]
    }
  },
  {
    "id": "phrase-l05-03",
    "category": "phrases",
    "level": 5,
    "before_fields": {
      "title_en": "I usually walk to school.",
      "title_ja": "たいてい歩いて学校へ行きます。",
      "content": {
        "phrase": "I usually walk to school.",
        "japanese": "たいてい歩いて学校へ行きます。",
        "situation": "普段の通学方法を話すとき",
        "naturalUsage": "usually を一般動詞の前に置いて、習慣を表します。",
        "exampleDialogue": "A: How do you get to school? B: I usually walk to school.",
        "commonMistake": "walk school ではなく、行き先の前に to を入れます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "routine",
        "frequency",
        "school"
      ]
    },
    "after_fields": {
      "title_en": "I usually walk to school.",
      "title_ja": "たいてい歩いて学校へ行きます。",
      "content": {
        "phrase": "I usually walk to school.",
        "japanese": "たいてい歩いて学校へ行きます。",
        "situation": "普段の通学方法を話すとき",
        "naturalUsage": "usually を一般動詞の前に置いて、習慣を表します。",
        "exampleDialogue": "A: How do you get to school? B: I usually walk to school.",
        "commonMistake": "walk school ではなく、行き先の前に to を入れます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-4414c96a403b79fd.svg",
          "kind": "sequence",
          "altEn": "A child walks from home to school on their usual daily route.",
          "altJa": "いつもの通学。普段の通学方法を話す場面。",
          "sceneEn": "A usual school journey",
          "sceneJa": "いつもの通学"
        }
      },
      "icon": "",
      "tags": [
        "routine",
        "frequency",
        "school"
      ]
    }
  },
  {
    "id": "phrase-l05-04",
    "category": "phrases",
    "level": 5,
    "before_fields": {
      "title_en": "See you tomorrow.",
      "title_ja": "また明日。",
      "content": {
        "phrase": "See you tomorrow.",
        "japanese": "また明日。",
        "situation": "翌日にまた会う相手と別れるとき",
        "naturalUsage": "学校や職場の帰りに使う親しみやすい別れの言葉です。",
        "exampleDialogue": "A: I'm going home now. B: Okay, see you tomorrow.",
        "commonMistake": "See you next tomorrow. とは言わず、tomorrow だけを使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "farewell",
        "time",
        "school"
      ]
    },
    "after_fields": {
      "title_en": "See you tomorrow.",
      "title_ja": "また明日。",
      "content": {
        "phrase": "See you tomorrow.",
        "japanese": "また明日。",
        "situation": "翌日にまた会う相手と別れるとき",
        "naturalUsage": "学校や職場の帰りに使う親しみやすい別れの言葉です。",
        "exampleDialogue": "A: I'm going home now. B: Okay, see you tomorrow.",
        "commonMistake": "See you next tomorrow. とは言わず、tomorrow だけを使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-779f4b41b1e34435.svg",
          "kind": "sequence",
          "altEn": "Classmates wave as one leaves and mark that they will meet tomorrow.",
          "altJa": "また翌日に会う別れ際。翌日にまた会う相手と別れる場面。",
          "sceneEn": "Leaving until the next day",
          "sceneJa": "また翌日に会う別れ際"
        }
      },
      "icon": "",
      "tags": [
        "farewell",
        "time",
        "school"
      ]
    }
  },
  {
    "id": "phrase-l06-01",
    "category": "phrases",
    "level": 6,
    "before_fields": {
      "title_en": "Can I have some water?",
      "title_ja": "お水をもらえますか？",
      "content": {
        "phrase": "Can I have some water?",
        "japanese": "お水をもらえますか？",
        "situation": "飲み物をお願いするとき",
        "naturalUsage": "家庭、学校、レストランで使える丁寧で基本的な頼み方です。",
        "exampleDialogue": "A: Can I have some water? B: Of course.",
        "commonMistake": "Can I have a water? より、量を表す some water が基本です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "food",
        "request",
        "restaurant"
      ]
    },
    "after_fields": {
      "title_en": "Can I have some water?",
      "title_ja": "お水をもらえますか？",
      "content": {
        "phrase": "Can I have some water?",
        "japanese": "お水をもらえますか？",
        "situation": "飲み物をお願いするとき",
        "naturalUsage": "家庭、学校、レストランで使える丁寧で基本的な頼み方です。",
        "exampleDialogue": "A: Can I have some water? B: Of course.",
        "commonMistake": "基本は some water です。店で a water と言うと、水を一杯・一本注文する意味で自然に使えます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-19c8f8e78f80464f.svg",
          "kind": "scene",
          "altEn": "A diner asks the server for a glass of water.",
          "altJa": "飲み物をお願い。飲み物をお願いする場面。",
          "sceneEn": "Asking for a drink",
          "sceneJa": "飲み物をお願い"
        }
      },
      "icon": "",
      "tags": [
        "food",
        "request",
        "restaurant"
      ]
    }
  },
  {
    "id": "phrase-l06-02",
    "category": "phrases",
    "level": 6,
    "before_fields": {
      "title_en": "It smells good.",
      "title_ja": "いい匂いがします。",
      "content": {
        "phrase": "It smells good.",
        "japanese": "いい匂いがします。",
        "situation": "料理の香りをほめるとき",
        "naturalUsage": "料理を見たり香りを感じたりした瞬間の自然な反応です。",
        "exampleDialogue": "A: I made curry. B: It smells good.",
        "commonMistake": "I'm smelling good. だと自分がよい匂いという意味になりやすいです。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "food",
        "reaction",
        "senses"
      ]
    },
    "after_fields": {
      "title_en": "It smells good.",
      "title_ja": "いい匂いがします。",
      "content": {
        "phrase": "It smells good.",
        "japanese": "いい匂いがします。",
        "situation": "料理の香りをほめるとき",
        "naturalUsage": "料理を見たり香りを感じたりした瞬間の自然な反応です。",
        "exampleDialogue": "A: I made curry. B: It smells good.",
        "commonMistake": "I'm smelling good. だと自分がよい匂いという意味になりやすいです。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-f91949896cfb421d.svg",
          "kind": "scene",
          "altEn": "A steaming bowl of soup has an inviting aroma that someone notices.",
          "altJa": "料理のいい香り。料理の香りをほめる場面。",
          "sceneEn": "A delicious smell",
          "sceneJa": "料理のいい香り"
        }
      },
      "icon": "",
      "tags": [
        "food",
        "reaction",
        "senses"
      ]
    }
  },
  {
    "id": "phrase-l06-03",
    "category": "phrases",
    "level": 6,
    "before_fields": {
      "title_en": "I'm full.",
      "title_ja": "おなかいっぱいです。",
      "content": {
        "phrase": "I'm full.",
        "japanese": "おなかいっぱいです。",
        "situation": "十分に食べたことを伝えるとき",
        "naturalUsage": "食事を終えたいときに短く自然に使えます。",
        "exampleDialogue": "A: Would you like more rice? B: No, thanks. I'm full.",
        "commonMistake": "My stomach is full. も意味は通じますが、会話では I'm full. が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "food",
        "feelings",
        "meal"
      ]
    },
    "after_fields": {
      "title_en": "I'm full.",
      "title_ja": "おなかいっぱいです。",
      "content": {
        "phrase": "I'm full.",
        "japanese": "おなかいっぱいです。",
        "situation": "十分に食べたことを伝えるとき",
        "naturalUsage": "食事を終えたいときに短く自然に使えます。",
        "exampleDialogue": "A: Would you like more rice? B: No, thanks. I'm full.",
        "commonMistake": "My stomach is full. も意味は通じますが、会話では I'm full. が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-0bd3ab8913f59f42.svg",
          "kind": "sequence",
          "altEn": "A diner finishes their meal and indicates that they have eaten enough.",
          "altJa": "食事を十分に食べて。十分に食べたことを伝える場面。",
          "sceneEn": "After a satisfying meal",
          "sceneJa": "食事を十分に食べて"
        }
      },
      "icon": "",
      "tags": [
        "food",
        "feelings",
        "meal"
      ]
    }
  },
  {
    "id": "phrase-l06-04",
    "category": "phrases",
    "level": 6,
    "before_fields": {
      "title_en": "Could I get this without cheese?",
      "title_ja": "これはチーズ抜きにできますか？",
      "content": {
        "phrase": "Could I get this without cheese?",
        "japanese": "これはチーズ抜きにできますか？",
        "situation": "料理から食材を抜いてほしいとき",
        "naturalUsage": "注文時に without を使って希望を明確に伝えます。",
        "exampleDialogue": "A: Could I get this without cheese? B: Yes, no problem.",
        "commonMistake": "no cheese だけでも通じますが、文にすると丁寧です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "restaurant",
        "request",
        "food"
      ]
    },
    "after_fields": {
      "title_en": "Could I get this without cheese?",
      "title_ja": "これはチーズ抜きにできますか？",
      "content": {
        "phrase": "Could I get this without cheese?",
        "japanese": "これはチーズ抜きにできますか？",
        "situation": "料理から食材を抜いてほしいとき",
        "naturalUsage": "注文時に without を使って希望を明確に伝えます。",
        "exampleDialogue": "A: Could I get this without cheese? B: Yes, no problem.",
        "commonMistake": "no cheese だけでも通じますが、文にすると丁寧です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-2e9abbe344aed624.svg",
          "kind": "contrast",
          "altEn": "A burger order is contrasted with the cheese ingredient that should be left out.",
          "altJa": "料理の材料を変更。料理から食材を抜いてほしい場面。",
          "sceneEn": "Changing a food order",
          "sceneJa": "料理の材料を変更"
        }
      },
      "icon": "",
      "tags": [
        "restaurant",
        "request",
        "food"
      ]
    }
  },
  {
    "id": "phrase-l07-01",
    "category": "phrases",
    "level": 7,
    "before_fields": {
      "title_en": "How much is this?",
      "title_ja": "これはいくらですか？",
      "content": {
        "phrase": "How much is this?",
        "japanese": "これはいくらですか？",
        "situation": "店で商品の値段を尋ねるとき",
        "naturalUsage": "商品を指しながら使える、買い物の基本表現です。",
        "exampleDialogue": "A: How much is this? B: It's twelve dollars.",
        "commonMistake": "How many is this? は数を尋ねる表現で、値段には How much を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "shopping",
        "price",
        "question"
      ]
    },
    "after_fields": {
      "title_en": "How much is this?",
      "title_ja": "これはいくらですか？",
      "content": {
        "phrase": "How much is this?",
        "japanese": "これはいくらですか？",
        "situation": "店で商品の値段を尋ねるとき",
        "naturalUsage": "商品を指しながら使える、買い物の基本表現です。",
        "exampleDialogue": "A: How much is this? B: It's twelve dollars.",
        "commonMistake": "How many is this? は数を尋ねる表現で、値段には How much を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-fd5d9dd42a599c2f.svg",
          "kind": "scene",
          "altEn": "A customer points to a shirt and asks how much money it costs.",
          "altJa": "値段を尋ねる。店で商品の値段を尋ねる場面。",
          "sceneEn": "Checking the price",
          "sceneJa": "値段を尋ねる"
        }
      },
      "icon": "",
      "tags": [
        "shopping",
        "price",
        "question"
      ]
    }
  },
  {
    "id": "phrase-l07-02",
    "category": "phrases",
    "level": 7,
    "before_fields": {
      "title_en": "Do you have this in blue?",
      "title_ja": "これの青はありますか？",
      "content": {
        "phrase": "Do you have this in blue?",
        "japanese": "これの青はありますか？",
        "situation": "同じ商品の別の色を探すとき",
        "naturalUsage": "in のあとに色やサイズを置いて在庫を尋ねます。",
        "exampleDialogue": "A: Do you have this in blue? B: Let me check.",
        "commonMistake": "Do you have blue this? ではなく、this in blue の順にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "shopping",
        "color",
        "request"
      ]
    },
    "after_fields": {
      "title_en": "Do you have this in blue?",
      "title_ja": "これの青はありますか？",
      "content": {
        "phrase": "Do you have this in blue?",
        "japanese": "これの青はありますか？",
        "situation": "同じ商品の別の色を探すとき",
        "naturalUsage": "in のあとに色やサイズを置いて在庫を尋ねます。",
        "exampleDialogue": "A: Do you have this in blue? B: Let me check.",
        "commonMistake": "Do you have blue this? ではなく、this in blue の順にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-26358b7e408aeeb9.svg",
          "kind": "contrast",
          "altEn": "A shopper compares the same shirt design in a warm colour and in blue.",
          "altJa": "欲しい色を探す。同じ商品の別の色を探す場面。",
          "sceneEn": "Finding the right colour",
          "sceneJa": "欲しい色を探す"
        }
      },
      "icon": "",
      "tags": [
        "shopping",
        "color",
        "request"
      ]
    }
  },
  {
    "id": "phrase-l07-03",
    "category": "phrases",
    "level": 7,
    "before_fields": {
      "title_en": "Can I try it on?",
      "title_ja": "試着してもいいですか？",
      "content": {
        "phrase": "Can I try it on?",
        "japanese": "試着してもいいですか？",
        "situation": "服や靴を試着したいとき",
        "naturalUsage": "try on は身につけて試すという意味の句動詞です。",
        "exampleDialogue": "A: Can I try it on? B: The fitting room is over there.",
        "commonMistake": "代名詞 it は try と on の間に置き、try on it とは通常言いません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "shopping",
        "clothes",
        "permission"
      ]
    },
    "after_fields": {
      "title_en": "Can I try it on?",
      "title_ja": "試着してもいいですか？",
      "content": {
        "phrase": "Can I try it on?",
        "japanese": "試着してもいいですか？",
        "situation": "服や靴を試着したいとき",
        "naturalUsage": "try on は身につけて試すという意味の句動詞です。",
        "exampleDialogue": "A: Can I try it on? B: The fitting room is over there.",
        "commonMistake": "代名詞 it は try と on の間に置き、try on it とは通常言いません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-382c64606ed95abc.svg",
          "kind": "sequence",
          "altEn": "A shopper selects a dress, tries it on, and checks the fit in a mirror.",
          "altJa": "試着する前。服や靴を試着したい場面。",
          "sceneEn": "Using the fitting room",
          "sceneJa": "試着する前"
        }
      },
      "icon": "",
      "tags": [
        "shopping",
        "clothes",
        "permission"
      ]
    }
  },
  {
    "id": "phrase-l07-04",
    "category": "phrases",
    "level": 7,
    "before_fields": {
      "title_en": "I'll take it.",
      "title_ja": "これにします。",
      "content": {
        "phrase": "I'll take it.",
        "japanese": "これにします。",
        "situation": "店で買う商品を決めたとき",
        "naturalUsage": "商品を選び終え、購入の意思を店員に伝える表現です。",
        "exampleDialogue": "A: Does the jacket fit? B: Yes, I'll take it.",
        "commonMistake": "I'll buy it. も正しいですが、接客場面では I'll take it. がとても自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "shopping",
        "decision",
        "purchase"
      ]
    },
    "after_fields": {
      "title_en": "I'll take it.",
      "title_ja": "これにします。",
      "content": {
        "phrase": "I'll take it.",
        "japanese": "これにします。",
        "situation": "店で買う商品を決めたとき",
        "naturalUsage": "商品を選び終え、購入の意思を店員に伝える表現です。",
        "exampleDialogue": "A: Does the jacket fit? B: Yes, I'll take it.",
        "commonMistake": "I'll buy it. も正しいですが、接客場面では I'll take it. がとても自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-6c24c5aaa00ca5e7.svg",
          "kind": "sequence",
          "altEn": "A customer chooses an item in the shop and gets a bank card ready to pay.",
          "altJa": "購入を決める。店で買う商品を決めた場面。",
          "sceneEn": "Deciding what to buy",
          "sceneJa": "購入を決める"
        }
      },
      "icon": "",
      "tags": [
        "shopping",
        "decision",
        "purchase"
      ]
    }
  },
  {
    "id": "phrase-l08-01",
    "category": "phrases",
    "level": 8,
    "before_fields": {
      "title_en": "How do I get to the station?",
      "title_ja": "駅へはどう行けばいいですか？",
      "content": {
        "phrase": "How do I get to the station?",
        "japanese": "駅へはどう行けばいいですか？",
        "situation": "道順を尋ねるとき",
        "naturalUsage": "How do I get to ...? は目的地までの行き方を尋ねる定番表現です。",
        "exampleDialogue": "A: How do I get to the station? B: Go straight for two blocks.",
        "commonMistake": "How can I go the station? ではなく、get to the station が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "directions",
        "travel",
        "question"
      ]
    },
    "after_fields": {
      "title_en": "How do I get to the station?",
      "title_ja": "駅へはどう行けばいいですか？",
      "content": {
        "phrase": "How do I get to the station?",
        "japanese": "駅へはどう行けばいいですか？",
        "situation": "道順を尋ねるとき",
        "naturalUsage": "How do I get to ...? は目的地までの行き方を尋ねる定番表現です。",
        "exampleDialogue": "A: How do I get to the station? B: Go straight for two blocks.",
        "commonMistake": "get to the station と、行き先の前に to を入れます。How can I get to the station? も自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-e06b3791b1c72c6a.svg",
          "kind": "scene",
          "altEn": "A traveller asks which road leads to the train station.",
          "altJa": "駅への道を尋ねる。道順を尋ねる場面。",
          "sceneEn": "Finding the station",
          "sceneJa": "駅への道を尋ねる"
        }
      },
      "icon": "",
      "tags": [
        "directions",
        "travel",
        "question"
      ]
    }
  },
  {
    "id": "phrase-l08-02",
    "category": "phrases",
    "level": 8,
    "before_fields": {
      "title_en": "Is it far from here?",
      "title_ja": "ここから遠いですか？",
      "content": {
        "phrase": "Is it far from here?",
        "japanese": "ここから遠いですか？",
        "situation": "目的地までの距離感を確認するとき",
        "naturalUsage": "道を聞いたあとに続けると便利な質問です。",
        "exampleDialogue": "A: Is it far from here? B: No, it's about five minutes away.",
        "commonMistake": "far away here ではなく、far from here と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "directions",
        "distance",
        "travel"
      ]
    },
    "after_fields": {
      "title_en": "Is it far from here?",
      "title_ja": "ここから遠いですか？",
      "content": {
        "phrase": "Is it far from here?",
        "japanese": "ここから遠いですか？",
        "situation": "目的地までの距離感を確認するとき",
        "naturalUsage": "道を聞いたあとに続けると便利な質問です。",
        "exampleDialogue": "A: Is it far from here? B: No, it's about five minutes away.",
        "commonMistake": "far away here ではなく、far from here と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-ad8270ea68946e4f.svg",
          "kind": "sequence",
          "altEn": "A traveller checks how near a destination is before walking there.",
          "altJa": "歩く距離を確認。目的地までの距離感を確認する場面。",
          "sceneEn": "Checking the walking distance",
          "sceneJa": "歩く距離を確認"
        }
      },
      "icon": "",
      "tags": [
        "directions",
        "distance",
        "travel"
      ]
    }
  },
  {
    "id": "phrase-l08-03",
    "category": "phrases",
    "level": 8,
    "before_fields": {
      "title_en": "It's across from the park.",
      "title_ja": "公園の向かい側にあります。",
      "content": {
        "phrase": "It's across from the park.",
        "japanese": "公園の向かい側にあります。",
        "situation": "建物や場所の位置を説明するとき",
        "naturalUsage": "across from を使うと、道などを挟んだ向かい側を表せます。",
        "exampleDialogue": "A: Where's the library? B: It's across from the park.",
        "commonMistake": "across the park では公園を横切る意味になるため、向かい側は across from です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "location",
        "directions",
        "prepositions"
      ]
    },
    "after_fields": {
      "title_en": "It's across from the park.",
      "title_ja": "公園の向かい側にあります。",
      "content": {
        "phrase": "It's across from the park.",
        "japanese": "公園の向かい側にあります。",
        "situation": "建物や場所の位置を説明するとき",
        "naturalUsage": "across from を使うと、道などを挟んだ向かい側を表せます。",
        "exampleDialogue": "A: Where's the library? B: It's across from the park.",
        "commonMistake": "across the park では公園を横切る意味になるため、向かい側は across from です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-a600808773e7f5e0.svg",
          "kind": "contrast",
          "altEn": "A shop and a park tree sit on opposite sides of the road.",
          "altJa": "建物の位置を説明。建物や場所の位置を説明する場面。",
          "sceneEn": "Describing a location",
          "sceneJa": "建物の位置を説明"
        }
      },
      "icon": "",
      "tags": [
        "location",
        "directions",
        "prepositions"
      ]
    }
  },
  {
    "id": "phrase-l08-04",
    "category": "phrases",
    "level": 8,
    "before_fields": {
      "title_en": "I think we're lost.",
      "title_ja": "道に迷ったみたいです。",
      "content": {
        "phrase": "I think we're lost.",
        "japanese": "道に迷ったみたいです。",
        "situation": "正しい道から外れたと思うとき",
        "naturalUsage": "断定せず I think を添えることで、状況を自然に共有します。",
        "exampleDialogue": "A: I don't see the museum. B: I think we're lost.",
        "commonMistake": "We're lose. ではなく、状態を表す形容詞 lost を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "directions",
        "problem",
        "travel"
      ]
    },
    "after_fields": {
      "title_en": "I think we're lost.",
      "title_ja": "道に迷ったみたいです。",
      "content": {
        "phrase": "I think we're lost.",
        "japanese": "道に迷ったみたいです。",
        "situation": "正しい道から外れたと思うとき",
        "naturalUsage": "断定せず I think を添えることで、状況を自然に共有します。",
        "exampleDialogue": "A: I don't see the museum. B: I think we're lost.",
        "commonMistake": "We're lose. ではなく、状態を表す形容詞 lost を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-24d049986b8e7127.svg",
          "kind": "scene",
          "altEn": "Travellers look confused at a road junction after losing their way.",
          "altJa": "道に迷ったところ。正しい道から外れたと思う場面。",
          "sceneEn": "A wrong turn",
          "sceneJa": "道に迷ったところ"
        }
      },
      "icon": "",
      "tags": [
        "directions",
        "problem",
        "travel"
      ]
    }
  },
  {
    "id": "phrase-l09-01",
    "category": "phrases",
    "level": 9,
    "before_fields": {
      "title_en": "It looks like rain.",
      "title_ja": "雨が降りそうです。",
      "content": {
        "phrase": "It looks like rain.",
        "japanese": "雨が降りそうです。",
        "situation": "空模様を見て雨を予想するとき",
        "naturalUsage": "見た様子から天気を予想する、日常的なひと言です。",
        "exampleDialogue": "A: Should we take an umbrella? B: Yes, it looks like rain.",
        "commonMistake": "It looks rain. ではなく、名詞 rain の前に like を入れます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "weather",
        "prediction",
        "daily-life"
      ]
    },
    "after_fields": {
      "title_en": "It looks like rain.",
      "title_ja": "雨が降りそうです。",
      "content": {
        "phrase": "It looks like rain.",
        "japanese": "雨が降りそうです。",
        "situation": "空模様を見て雨を予想するとき",
        "naturalUsage": "見た様子から天気を予想する、日常的なひと言です。",
        "exampleDialogue": "A: Should we take an umbrella? B: Yes, it looks like rain.",
        "commonMistake": "It looks rain. ではなく、名詞 rain の前に like を入れます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-1312fa126263acac.svg",
          "kind": "sequence",
          "altEn": "Dark clouds suggest approaching rain and someone gets a raincoat ready.",
          "altJa": "空模様を確認。空模様を見て雨を予想する場面。",
          "sceneEn": "Watching the sky",
          "sceneJa": "空模様を確認"
        }
      },
      "icon": "",
      "tags": [
        "weather",
        "prediction",
        "daily-life"
      ]
    }
  },
  {
    "id": "phrase-l09-02",
    "category": "phrases",
    "level": 9,
    "before_fields": {
      "title_en": "What are you doing this weekend?",
      "title_ja": "今週末は何をする予定ですか？",
      "content": {
        "phrase": "What are you doing this weekend?",
        "japanese": "今週末は何をする予定ですか？",
        "situation": "近い週末の予定を尋ねるとき",
        "naturalUsage": "現在進行形で、すでに考えている近い未来の予定を聞けます。",
        "exampleDialogue": "A: What are you doing this weekend? B: I'm visiting my grandparents.",
        "commonMistake": "this weekend の前に on は通常つけません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "plans",
        "weekend",
        "question"
      ]
    },
    "after_fields": {
      "title_en": "What are you doing this weekend?",
      "title_ja": "今週末は何をする予定ですか？",
      "content": {
        "phrase": "What are you doing this weekend?",
        "japanese": "今週末は何をする予定ですか？",
        "situation": "近い週末の予定を尋ねるとき",
        "naturalUsage": "現在進行形で、すでに考えている近い未来の予定を聞けます。",
        "exampleDialogue": "A: What are you doing this weekend? B: I'm visiting my grandparents.",
        "commonMistake": "this weekend の前に on は通常つけません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-39aa21bd2be762e3.svg",
          "kind": "scene",
          "altEn": "Friends look at their weekend calendar and consider a game of badminton.",
          "altJa": "週末の予定を相談。近い週末の予定を尋ねる場面。",
          "sceneEn": "Making weekend plans",
          "sceneJa": "週末の予定を相談"
        }
      },
      "icon": "",
      "tags": [
        "plans",
        "weekend",
        "question"
      ]
    }
  },
  {
    "id": "phrase-l09-03",
    "category": "phrases",
    "level": 9,
    "before_fields": {
      "title_en": "Let's stay inside today.",
      "title_ja": "今日は中で過ごそう。",
      "content": {
        "phrase": "Let's stay inside today.",
        "japanese": "今日は中で過ごそう。",
        "situation": "天気が悪く屋内で過ごす提案をするとき",
        "naturalUsage": "stay inside は外出せず室内にいるという自然な表現です。",
        "exampleDialogue": "A: It's really windy. B: Let's stay inside today.",
        "commonMistake": "stay in inside のように前置詞を重ねません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "weather",
        "suggestion",
        "plans"
      ]
    },
    "after_fields": {
      "title_en": "Let's stay inside today.",
      "title_ja": "今日は中で過ごそう。",
      "content": {
        "phrase": "Let's stay inside today.",
        "japanese": "今日は中で過ごそう。",
        "situation": "天気が悪く屋内で過ごす提案をするとき",
        "naturalUsage": "stay inside は外出せず室内にいるという自然な表現です。",
        "exampleDialogue": "A: It's really windy. B: Let's stay inside today.",
        "commonMistake": "stay in inside のように前置詞を重ねません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-6da44e7fdd3cd9f5.svg",
          "kind": "contrast",
          "altEn": "Rain falls outside while friends choose to play cards indoors.",
          "altJa": "雨の日に屋内で過ごす。天気が悪く屋内で過ごす提案をする場面。",
          "sceneEn": "A rainy day indoors",
          "sceneJa": "雨の日に屋内で過ごす"
        }
      },
      "icon": "",
      "tags": [
        "weather",
        "suggestion",
        "plans"
      ]
    }
  },
  {
    "id": "phrase-l09-04",
    "category": "phrases",
    "level": 9,
    "before_fields": {
      "title_en": "The weather cleared up.",
      "title_ja": "天気が回復しました。",
      "content": {
        "phrase": "The weather cleared up.",
        "japanese": "天気が回復しました。",
        "situation": "雨や曇りのあとに空が晴れたとき",
        "naturalUsage": "clear up は悪かった天気がよくなる変化を表します。",
        "exampleDialogue": "A: Can we play outside now? B: Sure. The weather cleared up.",
        "commonMistake": "The weather became clear. も文法的ですが、会話では cleared up が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "weather",
        "change",
        "phrasal-verb"
      ]
    },
    "after_fields": {
      "title_en": "The weather cleared up.",
      "title_ja": "天気が回復しました。",
      "content": {
        "phrase": "The weather cleared up.",
        "japanese": "天気が回復しました。",
        "situation": "雨や曇りのあとに空が晴れたとき",
        "naturalUsage": "clear up は悪かった天気がよくなる変化を表します。",
        "exampleDialogue": "A: Can we play outside now? B: Sure. The weather cleared up.",
        "commonMistake": "The weather became clear. も文法的ですが、会話では cleared up が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-b5f52b2240715c2c.svg",
          "kind": "sequence",
          "altEn": "A rainy sky becomes cloudy and then clears to sunshine.",
          "altJa": "雨上がり。雨や曇りのあとに空が晴れた場面。",
          "sceneEn": "After the rain",
          "sceneJa": "雨上がり"
        }
      },
      "icon": "",
      "tags": [
        "weather",
        "change",
        "phrasal-verb"
      ]
    }
  },
  {
    "id": "phrase-l10-01",
    "category": "phrases",
    "level": 10,
    "before_fields": {
      "title_en": "I don't feel well.",
      "title_ja": "気分がよくありません。",
      "content": {
        "phrase": "I don't feel well.",
        "japanese": "気分がよくありません。",
        "situation": "体調が悪いことを伝えるとき",
        "naturalUsage": "症状がはっきりしなくても使える便利な表現です。",
        "exampleDialogue": "A: You look tired. B: I don't feel well.",
        "commonMistake": "I don't feel good. も会話では使われますが、well は体調を明確に表します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "health",
        "feelings",
        "problem"
      ]
    },
    "after_fields": {
      "title_en": "I don't feel well.",
      "title_ja": "気分がよくありません。",
      "content": {
        "phrase": "I don't feel well.",
        "japanese": "気分がよくありません。",
        "situation": "体調が悪いことを伝えるとき",
        "naturalUsage": "症状がはっきりしなくても使える便利な表現です。",
        "exampleDialogue": "A: You look tired. B: I don't feel well.",
        "commonMistake": "I don't feel good. も会話では使われますが、well は体調を明確に表します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-8932f1aa4f286714.svg",
          "kind": "scene",
          "altEn": "Someone with a headache closes their eyes to rest with medicine nearby.",
          "altJa": "体調が悪いとき。体調が悪いことを伝える場面。",
          "sceneEn": "Feeling unwell",
          "sceneJa": "体調が悪いとき"
        }
      },
      "icon": "",
      "tags": [
        "health",
        "feelings",
        "problem"
      ]
    }
  },
  {
    "id": "phrase-l10-02",
    "category": "phrases",
    "level": 10,
    "before_fields": {
      "title_en": "My throat hurts.",
      "title_ja": "のどが痛いです。",
      "content": {
        "phrase": "My throat hurts.",
        "japanese": "のどが痛いです。",
        "situation": "のどの痛みを説明するとき",
        "naturalUsage": "体の部位を主語にして hurts と言う簡単な症状表現です。",
        "exampleDialogue": "A: What's wrong? B: My throat hurts.",
        "commonMistake": "I hurt my throat. は自分でのどを傷つけたという意味になります。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "health",
        "symptoms",
        "body"
      ]
    },
    "after_fields": {
      "title_en": "My throat hurts.",
      "title_ja": "のどが痛いです。",
      "content": {
        "phrase": "My throat hurts.",
        "japanese": "のどが痛いです。",
        "situation": "のどの痛みを説明するとき",
        "naturalUsage": "体の部位を主語にして hurts と言う簡単な症状表現です。",
        "exampleDialogue": "A: What's wrong? B: My throat hurts.",
        "commonMistake": "I hurt my throat. は自分でのどを傷つけたという意味になります。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-d4a77eb92db98447.svg",
          "kind": "scene",
          "altEn": "A person with a cold points out their sore throat and reaches for a warm drink.",
          "altJa": "のどの症状を伝える。のどの痛みを説明する場面。",
          "sceneEn": "Describing a sore throat",
          "sceneJa": "のどの症状を伝える"
        }
      },
      "icon": "",
      "tags": [
        "health",
        "symptoms",
        "body"
      ]
    }
  },
  {
    "id": "phrase-l10-03",
    "category": "phrases",
    "level": 10,
    "before_fields": {
      "title_en": "I need to take a break.",
      "title_ja": "休憩する必要があります。",
      "content": {
        "phrase": "I need to take a break.",
        "japanese": "休憩する必要があります。",
        "situation": "疲れて少し休みたいとき",
        "naturalUsage": "勉強、運動、仕事をいったん止めたい場面で使えます。",
        "exampleDialogue": "A: Do you want to keep going? B: I need to take a break.",
        "commonMistake": "take rest より take a break が自然な組み合わせです。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "health",
        "rest",
        "request"
      ]
    },
    "after_fields": {
      "title_en": "I need to take a break.",
      "title_ja": "休憩する必要があります。",
      "content": {
        "phrase": "I need to take a break.",
        "japanese": "休憩する必要があります。",
        "situation": "疲れて少し休みたいとき",
        "naturalUsage": "勉強、運動、仕事をいったん止めたい場面で使えます。",
        "exampleDialogue": "A: Do you want to keep going? B: I need to take a break.",
        "commonMistake": "take rest より take a break が自然な組み合わせです。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-ef208645d6ca5755.svg",
          "kind": "sequence",
          "altEn": "Someone stops working at a computer to take a short drink break.",
          "altJa": "作業の途中で休む。疲れて少し休みたい場面。",
          "sceneEn": "Taking a work break",
          "sceneJa": "作業の途中で休む"
        }
      },
      "icon": "",
      "tags": [
        "health",
        "rest",
        "request"
      ]
    }
  },
  {
    "id": "phrase-l10-04",
    "category": "phrases",
    "level": 10,
    "before_fields": {
      "title_en": "Are you feeling better?",
      "title_ja": "具合はよくなりましたか？",
      "content": {
        "phrase": "Are you feeling better?",
        "japanese": "具合はよくなりましたか？",
        "situation": "体調を崩した人の回復具合を尋ねるとき",
        "naturalUsage": "相手を気づかう、やさしく自然な質問です。",
        "exampleDialogue": "A: Are you feeling better? B: Yes, a little. Thanks.",
        "commonMistake": "Do you feel better? も正しいですが、回復中の様子には Are you feeling better? が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "health",
        "care",
        "question"
      ]
    },
    "after_fields": {
      "title_en": "Are you feeling better?",
      "title_ja": "具合はよくなりましたか？",
      "content": {
        "phrase": "Are you feeling better?",
        "japanese": "具合はよくなりましたか？",
        "situation": "体調を崩した人の回復具合を尋ねるとき",
        "naturalUsage": "相手を気づかう、やさしく自然な質問です。",
        "exampleDialogue": "A: Are you feeling better? B: Yes, a little. Thanks.",
        "commonMistake": "Are you feeling better? と Do you feel better? はどちらも回復を気づかう自然な質問です。better は good / well の比較級です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-834ad7d19c17669d.svg",
          "kind": "contrast",
          "altEn": "An earlier headache is contrasted with feeling healthy again as a friend checks in.",
          "altJa": "回復したか気づかう。体調を崩した人の回復具合を尋ねる場面。",
          "sceneEn": "Checking on recovery",
          "sceneJa": "回復したか気づかう"
        }
      },
      "icon": "",
      "tags": [
        "health",
        "care",
        "question"
      ]
    }
  },
  {
    "id": "phrase-l11-01",
    "category": "phrases",
    "level": 11,
    "before_fields": {
      "title_en": "Do you want to join us?",
      "title_ja": "一緒に参加しませんか？",
      "content": {
        "phrase": "Do you want to join us?",
        "japanese": "一緒に参加しませんか？",
        "situation": "友達を活動に誘うとき",
        "naturalUsage": "すでに始めているグループへ相手を気軽に招く表現です。",
        "exampleDialogue": "A: We're playing cards. Do you want to join us? B: Sure!",
        "commonMistake": "join with us ではなく、join us と直接つなげます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "invitation",
        "friends",
        "activities"
      ]
    },
    "after_fields": {
      "title_en": "Do you want to join us?",
      "title_ja": "一緒に参加しませんか？",
      "content": {
        "phrase": "Do you want to join us?",
        "japanese": "一緒に参加しませんか？",
        "situation": "友達を活動に誘うとき",
        "naturalUsage": "すでに始めているグループへ相手を気軽に招く表現です。",
        "exampleDialogue": "A: We're playing cards. Do you want to join us? B: Sure!",
        "commonMistake": "join with us ではなく、join us と直接つなげます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-af00680f7d1d907e.svg",
          "kind": "scene",
          "altEn": "A group playing basketball invites another person to join the game.",
          "altJa": "遊びに友達を誘う。友達を活動に誘う場面。",
          "sceneEn": "Inviting someone to play",
          "sceneJa": "遊びに友達を誘う"
        }
      },
      "icon": "",
      "tags": [
        "invitation",
        "friends",
        "activities"
      ]
    }
  },
  {
    "id": "phrase-l11-02",
    "category": "phrases",
    "level": 11,
    "before_fields": {
      "title_en": "That sounds fun.",
      "title_ja": "楽しそうですね。",
      "content": {
        "phrase": "That sounds fun.",
        "japanese": "楽しそうですね。",
        "situation": "相手の提案や予定に興味を示すとき",
        "naturalUsage": "聞いた内容への前向きな反応として使います。",
        "exampleDialogue": "A: We're going bowling after lunch. B: That sounds fun.",
        "commonMistake": "That sounds funny. は「おかしく聞こえる」という意味になることがあります。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "reaction",
        "invitation",
        "positive"
      ]
    },
    "after_fields": {
      "title_en": "That sounds fun.",
      "title_ja": "楽しそうですね。",
      "content": {
        "phrase": "That sounds fun.",
        "japanese": "楽しそうですね。",
        "situation": "相手の提案や予定に興味を示すとき",
        "naturalUsage": "聞いた内容への前向きな反応として使います。",
        "exampleDialogue": "A: We're going bowling after lunch. B: That sounds fun.",
        "commonMistake": "That sounds funny. は「おかしく聞こえる」という意味になることがあります。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-1d5c17c45061953c.svg",
          "kind": "scene",
          "altEn": "A suggested visit to a theme park receives an enthusiastic response.",
          "altJa": "楽しそうな提案を聞く。相手の提案や予定に興味を示す場面。",
          "sceneEn": "Responding to an invitation",
          "sceneJa": "楽しそうな提案を聞く"
        }
      },
      "icon": "",
      "tags": [
        "reaction",
        "invitation",
        "positive"
      ]
    }
  },
  {
    "id": "phrase-l11-03",
    "category": "phrases",
    "level": 11,
    "before_fields": {
      "title_en": "Maybe next time.",
      "title_ja": "また今度ね。",
      "content": {
        "phrase": "Maybe next time.",
        "japanese": "また今度ね。",
        "situation": "誘いをやわらかく断るとき",
        "naturalUsage": "今は参加できないことを角を立てずに伝えます。",
        "exampleDialogue": "A: Can you come to the game? B: I can't today. Maybe next time.",
        "commonMistake": "Next time maybe. より Maybe next time. の語順が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "declining",
        "invitation",
        "softening"
      ]
    },
    "after_fields": {
      "title_en": "Maybe next time.",
      "title_ja": "また今度ね。",
      "content": {
        "phrase": "Maybe next time.",
        "japanese": "また今度ね。",
        "situation": "誘いをやわらかく断るとき",
        "naturalUsage": "今は参加できないことを角を立てずに伝えます。",
        "exampleDialogue": "A: Can you come to the game? B: I can't today. Maybe next time.",
        "commonMistake": "Maybe next time. は確約ではありません。本当に次の予定を立てたいなら、別の日を提案しましょう。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-50ab87c345d06127.svg",
          "kind": "contrast",
          "altEn": "Someone is busy this weekend and suggests meeting another time.",
          "altJa": "今日は見送る誘い。誘いをやわらかく断る場面。",
          "sceneEn": "Declining for today",
          "sceneJa": "今日は見送る誘い"
        }
      },
      "icon": "",
      "tags": [
        "declining",
        "invitation",
        "softening"
      ]
    }
  },
  {
    "id": "phrase-l11-04",
    "category": "phrases",
    "level": 11,
    "before_fields": {
      "title_en": "I'm really into drawing.",
      "title_ja": "絵を描くことにすごく夢中です。",
      "content": {
        "phrase": "I'm really into drawing.",
        "japanese": "絵を描くことにすごく夢中です。",
        "situation": "今熱中している趣味を話すとき",
        "naturalUsage": "be into ... は、好きで夢中になっていることを会話的に表します。",
        "exampleDialogue": "A: What do you do for fun? B: I'm really into drawing.",
        "commonMistake": "I'm interesting in drawing. ではなく、interested in または into を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "hobbies",
        "interest",
        "conversation"
      ]
    },
    "after_fields": {
      "title_en": "I'm really into drawing.",
      "title_ja": "絵を描くことにすごく夢中です。",
      "content": {
        "phrase": "I'm really into drawing.",
        "japanese": "絵を描くことにすごく夢中です。",
        "situation": "今熱中している趣味を話すとき",
        "naturalUsage": "be into ... は、好きで夢中になっていることを会話的に表します。",
        "exampleDialogue": "A: What do you do for fun? B: I'm really into drawing.",
        "commonMistake": "I'm interesting in drawing. ではなく、interested in または into を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-96be87753c752a62.svg",
          "kind": "scene",
          "altEn": "A keen artist fills paper and a colouring book with drawings.",
          "altJa": "お絵かきに夢中。今熱中している趣味を話す場面。",
          "sceneEn": "A drawing hobby",
          "sceneJa": "お絵かきに夢中"
        }
      },
      "icon": "",
      "tags": [
        "hobbies",
        "interest",
        "conversation"
      ]
    }
  },
  {
    "id": "phrase-l12-01",
    "category": "phrases",
    "level": 12,
    "before_fields": {
      "title_en": "What page are we on?",
      "title_ja": "今、何ページですか？",
      "content": {
        "phrase": "What page are we on?",
        "japanese": "今、何ページですか？",
        "situation": "授業で開くページを確認するとき",
        "naturalUsage": "授業の進行についていけなくなったときにすぐ使えます。",
        "exampleDialogue": "A: What page are we on? B: Page thirty-four.",
        "commonMistake": "Which page we are? ではなく、What page are we on? が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "school",
        "classroom",
        "clarification"
      ]
    },
    "after_fields": {
      "title_en": "What page are we on?",
      "title_ja": "今、何ページですか？",
      "content": {
        "phrase": "What page are we on?",
        "japanese": "今、何ページですか？",
        "situation": "授業で開くページを確認するとき",
        "naturalUsage": "授業の進行についていけなくなったときにすぐ使えます。",
        "exampleDialogue": "A: What page are we on? B: Page thirty-four.",
        "commonMistake": "Which page we are? ではなく、What page are we on? が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-41ea2cdc1a7c31ec.svg",
          "kind": "scene",
          "altEn": "A learner looks through a workbook to find the page the class is using.",
          "altJa": "授業のページを確認。授業で開くページを確認する場面。",
          "sceneEn": "Finding the class page",
          "sceneJa": "授業のページを確認"
        }
      },
      "icon": "",
      "tags": [
        "school",
        "classroom",
        "clarification"
      ]
    }
  },
  {
    "id": "phrase-l12-02",
    "category": "phrases",
    "level": 12,
    "before_fields": {
      "title_en": "Can we work together?",
      "title_ja": "一緒に取り組んでもいい？",
      "content": {
        "phrase": "Can we work together?",
        "japanese": "一緒に取り組んでもいい？",
        "situation": "ペアやグループで作業したいとき",
        "naturalUsage": "クラスメートを共同作業に誘う簡潔な表現です。",
        "exampleDialogue": "A: Can we work together? B: Yes, let's be partners.",
        "commonMistake": "work together with us のように不要な語を足さず、二人ならこの形で十分です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "school",
        "teamwork",
        "request"
      ]
    },
    "after_fields": {
      "title_en": "Can we work together?",
      "title_ja": "一緒に取り組んでもいい？",
      "content": {
        "phrase": "Can we work together?",
        "japanese": "一緒に取り組んでもいい？",
        "situation": "ペアやグループで作業したいとき",
        "naturalUsage": "先生には一緒に作業してよいかを尋ねられます。友達には協力を提案する形にもなります。",
        "exampleDialogue": "A: Can we work together? B: Yes, let's be partners.",
        "commonMistake": "Can we work together? では work の原形を使います。working を続けません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-6ad1de1973a7832e.svg",
          "kind": "scene",
          "altEn": "Two learners bring a worksheet to a shared work area to solve it together.",
          "altJa": "ペアで課題に取り組む。ペアやグループで作業したい場面。",
          "sceneEn": "Working as a pair",
          "sceneJa": "ペアで課題に取り組む"
        }
      },
      "icon": "",
      "tags": [
        "school",
        "teamwork",
        "request"
      ]
    }
  },
  {
    "id": "phrase-l12-03",
    "category": "phrases",
    "level": 12,
    "before_fields": {
      "title_en": "I left my notebook at home.",
      "title_ja": "ノートを家に置いてきました。",
      "content": {
        "phrase": "I left my notebook at home.",
        "japanese": "ノートを家に置いてきました。",
        "situation": "必要な持ち物を家に忘れたとき",
        "naturalUsage": "忘れた物が今も家にある場合は left ... at home が自然です。",
        "exampleDialogue": "A: Where's your notebook? B: I left my notebook at home.",
        "commonMistake": "I forgot my notebook at home. より left my notebook at home が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "school",
        "mistake",
        "belongings"
      ]
    },
    "after_fields": {
      "title_en": "I left my notebook at home.",
      "title_ja": "ノートを家に置いてきました。",
      "content": {
        "phrase": "I left my notebook at home.",
        "japanese": "ノートを家に置いてきました。",
        "situation": "必要な持ち物を家に忘れたとき",
        "naturalUsage": "忘れた物が今も家にある場合は left ... at home が自然です。",
        "exampleDialogue": "A: Where's your notebook? B: I left my notebook at home.",
        "commonMistake": "I left my notebook at home. は置いてきた場所を伝えます。I forgot my notebook. は持参し忘れたことに焦点を当てます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-03147b6d713b601f.svg",
          "kind": "contrast",
          "altEn": "A notebook remains at home while a learner discovers it is absent from their school bag.",
          "altJa": "ノートを忘れて登校。必要な持ち物を家に忘れた場面。",
          "sceneEn": "A forgotten notebook",
          "sceneJa": "ノートを忘れて登校"
        }
      },
      "icon": "",
      "tags": [
        "school",
        "mistake",
        "belongings"
      ]
    }
  },
  {
    "id": "phrase-l12-04",
    "category": "phrases",
    "level": 12,
    "before_fields": {
      "title_en": "Good luck on your test.",
      "title_ja": "テスト、頑張ってね。",
      "content": {
        "phrase": "Good luck on your test.",
        "japanese": "テスト、頑張ってね。",
        "situation": "テスト前の相手を応援するとき",
        "naturalUsage": "on your test と添えて、何について応援しているかを示します。",
        "exampleDialogue": "A: I have a math test today. B: Good luck on your test.",
        "commonMistake": "Fight! は日本語の「ファイト」の意味では通常使いません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "school",
        "encouragement",
        "test"
      ]
    },
    "after_fields": {
      "title_en": "Good luck on your test.",
      "title_ja": "テスト、頑張ってね。",
      "content": {
        "phrase": "Good luck on your test.",
        "japanese": "テスト、頑張ってね。",
        "situation": "テスト前の相手を応援するとき",
        "naturalUsage": "on your test と添えて、何について応援しているかを示します。",
        "exampleDialogue": "A: I have a math test today. B: Good luck on your test.",
        "commonMistake": "Fight! は日本語の「ファイト」の意味では通常使いません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-6d95b8eaaa5b13c8.svg",
          "kind": "scene",
          "altEn": "A friend offers encouragement and crosses their fingers before a test.",
          "altJa": "テスト前に応援。テスト前の相手を応援する場面。",
          "sceneEn": "Encouraging a test taker",
          "sceneJa": "テスト前に応援"
        }
      },
      "icon": "",
      "tags": [
        "school",
        "encouragement",
        "test"
      ]
    }
  },
  {
    "id": "phrase-l13-01",
    "category": "phrases",
    "level": 13,
    "before_fields": {
      "title_en": "I've never tried that before.",
      "title_ja": "それは今までやったことがありません。",
      "content": {
        "phrase": "I've never tried that before.",
        "japanese": "それは今までやったことがありません。",
        "situation": "初めての体験だと伝えるとき",
        "naturalUsage": "現在までの経験の有無を現在完了で表します。",
        "exampleDialogue": "A: Have you ever gone kayaking? B: I've never tried that before.",
        "commonMistake": "I've never tried that ago. のように現在完了と ago を一緒に使いません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "experience",
        "present-perfect",
        "conversation"
      ]
    },
    "after_fields": {
      "title_en": "I've never tried that before.",
      "title_ja": "それは今までやったことがありません。",
      "content": {
        "phrase": "I've never tried that before.",
        "japanese": "それは今までやったことがありません。",
        "situation": "初めての体験だと伝えるとき",
        "naturalUsage": "現在までの経験の有無を現在完了で表します。",
        "exampleDialogue": "A: Have you ever gone kayaking? B: I've never tried that before.",
        "commonMistake": "I've never tried that ago. のように現在完了と ago を一緒に使いません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-372fc2cd3c87bb42.svg",
          "kind": "scene",
          "altEn": "Someone picks up a paint box and starts painting for the first time.",
          "altJa": "初めての体験。初めての体験だと伝える場面。",
          "sceneEn": "A first attempt",
          "sceneJa": "初めての体験"
        }
      },
      "icon": "",
      "tags": [
        "experience",
        "present-perfect",
        "conversation"
      ]
    }
  },
  {
    "id": "phrase-l13-02",
    "category": "phrases",
    "level": 13,
    "before_fields": {
      "title_en": "It was better than I expected.",
      "title_ja": "思っていたよりよかったです。",
      "content": {
        "phrase": "It was better than I expected.",
        "japanese": "思っていたよりよかったです。",
        "situation": "体験が予想以上によかったとき",
        "naturalUsage": "映画、食事、イベントなどの感想に幅広く使えます。",
        "exampleDialogue": "A: How was the school play? B: It was better than I expected.",
        "commonMistake": "better than I expected it のように末尾へ it を足しません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "experience",
        "comparison",
        "reaction"
      ]
    },
    "after_fields": {
      "title_en": "It was better than I expected.",
      "title_ja": "思っていたよりよかったです。",
      "content": {
        "phrase": "It was better than I expected.",
        "japanese": "思っていたよりよかったです。",
        "situation": "体験が予想以上によかったとき",
        "naturalUsage": "映画、食事、イベントなどの感想に幅広く使えます。",
        "exampleDialogue": "A: How was the school play? B: It was better than I expected.",
        "commonMistake": "better than I expected it のように末尾へ it を足しません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-fd649dacf8fc5e63.svg",
          "kind": "contrast",
          "altEn": "An uncertain diner tries a meal and is pleasantly surprised by how good it is.",
          "altJa": "予想以上によかった食事。体験が予想以上によかった場面。",
          "sceneEn": "An unexpectedly good meal",
          "sceneJa": "予想以上によかった食事"
        }
      },
      "icon": "",
      "tags": [
        "experience",
        "comparison",
        "reaction"
      ]
    }
  },
  {
    "id": "phrase-l13-03",
    "category": "phrases",
    "level": 13,
    "before_fields": {
      "title_en": "I had a great time.",
      "title_ja": "とても楽しかったです。",
      "content": {
        "phrase": "I had a great time.",
        "japanese": "とても楽しかったです。",
        "situation": "イベントや訪問の感想を伝えるとき",
        "naturalUsage": "帰り際や翌日に、楽しい時間への感謝も込めて使えます。",
        "exampleDialogue": "A: Thanks for coming today. B: I had a great time.",
        "commonMistake": "I was a great time. ではなく、have a great time を過去形にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "experience",
        "past",
        "positive"
      ]
    },
    "after_fields": {
      "title_en": "I had a great time.",
      "title_ja": "とても楽しかったです。",
      "content": {
        "phrase": "I had a great time.",
        "japanese": "とても楽しかったです。",
        "situation": "イベントや訪問の感想を伝えるとき",
        "naturalUsage": "帰り際や翌日に、楽しい時間への感謝も込めて使えます。",
        "exampleDialogue": "A: Thanks for coming today. B: I had a great time.",
        "commonMistake": "I was a great time. ではなく、have a great time を過去形にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-8b16f5ff5dce278a.svg",
          "kind": "scene",
          "altEn": "A smiling guest remembers a celebration with a birthday cake.",
          "altJa": "楽しかった会を振り返る。イベントや訪問の感想を伝える場面。",
          "sceneEn": "Remembering a great celebration",
          "sceneJa": "楽しかった会を振り返る"
        }
      },
      "icon": "",
      "tags": [
        "experience",
        "past",
        "positive"
      ]
    }
  },
  {
    "id": "phrase-l13-04",
    "category": "phrases",
    "level": 13,
    "before_fields": {
      "title_en": "How did it go?",
      "title_ja": "どうだった？",
      "content": {
        "phrase": "How did it go?",
        "japanese": "どうだった？",
        "situation": "相手が終えた出来事の結果や様子を尋ねるとき",
        "naturalUsage": "試験、面接、発表など、すでに話題になっている出来事に使います。",
        "exampleDialogue": "A: I just finished my interview. B: How did it go?",
        "commonMistake": "How was it going? は進行中の様子を尋ねる意味になり、結果を聞く形とは異なります。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "experience",
        "follow-up",
        "question"
      ]
    },
    "after_fields": {
      "title_en": "How did it go?",
      "title_ja": "どうだった？",
      "content": {
        "phrase": "How did it go?",
        "japanese": "どうだった？",
        "situation": "相手が終えた出来事の結果や様子を尋ねるとき",
        "naturalUsage": "試験、面接、発表など、すでに話題になっている出来事に使います。",
        "exampleDialogue": "A: I just finished my interview. B: How did it go?",
        "commonMistake": "How was it going? は進行中の様子を尋ねる意味になり、結果を聞く形とは異なります。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-9fed7d87a214954a.svg",
          "kind": "sequence",
          "altEn": "After a test is finished, a friend asks how it went.",
          "altJa": "終わった出来事の感想を聞く。相手が終えた出来事の結果や様子を尋ねる場面。",
          "sceneEn": "Asking about a result",
          "sceneJa": "終わった出来事の感想を聞く"
        }
      },
      "icon": "",
      "tags": [
        "experience",
        "follow-up",
        "question"
      ]
    }
  },
  {
    "id": "phrase-l14-01",
    "category": "phrases",
    "level": 14,
    "before_fields": {
      "title_en": "Are you free after school?",
      "title_ja": "放課後、時間ある？",
      "content": {
        "phrase": "Are you free after school?",
        "japanese": "放課後、時間ある？",
        "situation": "相手の予定が空いているか確認するとき",
        "naturalUsage": "誘いを出す前に都合を尋ねる自然な導入です。",
        "exampleDialogue": "A: Are you free after school? B: Yes, until five.",
        "commonMistake": "Do you free? ではなく、形容詞 free の前に be動詞を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "plans",
        "availability",
        "friends"
      ]
    },
    "after_fields": {
      "title_en": "Are you free after school?",
      "title_ja": "放課後、時間ある？",
      "content": {
        "phrase": "Are you free after school?",
        "japanese": "放課後、時間ある？",
        "situation": "相手の予定が空いているか確認するとき",
        "naturalUsage": "誘いを出す前に都合を尋ねる自然な導入です。",
        "exampleDialogue": "A: Are you free after school? B: Yes, until five.",
        "commonMistake": "Do you free? ではなく、形容詞 free の前に be動詞を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-4ab1c2bb57cf2566.svg",
          "kind": "sequence",
          "altEn": "Friends check the time after school and discuss playing badminton.",
          "altJa": "放課後の空き時間を確認。相手の予定が空いているか確認する場面。",
          "sceneEn": "Checking after-school availability",
          "sceneJa": "放課後の空き時間を確認"
        }
      },
      "icon": "",
      "tags": [
        "plans",
        "availability",
        "friends"
      ]
    }
  },
  {
    "id": "phrase-l14-02",
    "category": "phrases",
    "level": 14,
    "before_fields": {
      "title_en": "I'm planning to leave early.",
      "title_ja": "早めに出る予定です。",
      "content": {
        "phrase": "I'm planning to leave early.",
        "japanese": "早めに出る予定です。",
        "situation": "自分が考えている予定を共有するとき",
        "naturalUsage": "確定に近い個人的な計画を plan to で伝えます。",
        "exampleDialogue": "A: Will traffic be busy? B: Maybe, so I'm planning to leave early.",
        "commonMistake": "I'm planning leave ではなく、planning to leave とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "plans",
        "future",
        "time"
      ]
    },
    "after_fields": {
      "title_en": "I'm planning to leave early.",
      "title_ja": "早めに出る予定です。",
      "content": {
        "phrase": "I'm planning to leave early.",
        "japanese": "早めに出る予定です。",
        "situation": "自分が考えている予定を共有するとき",
        "naturalUsage": "plan to で今考えている計画を伝えます。予定が確定しているとは限りません。",
        "exampleDialogue": "A: Will traffic be busy? B: Maybe, so I'm planning to leave early.",
        "commonMistake": "I'm planning leave ではなく、planning to leave とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-705aa57444f93ba3.svg",
          "kind": "sequence",
          "altEn": "A traveller packs a suitcase and plans to leave before the usual time.",
          "altJa": "早めの出発を計画。自分が考えている予定を共有する場面。",
          "sceneEn": "Planning an early departure",
          "sceneJa": "早めの出発を計画"
        }
      },
      "icon": "",
      "tags": [
        "plans",
        "future",
        "time"
      ]
    }
  },
  {
    "id": "phrase-l14-03",
    "category": "phrases",
    "level": 14,
    "before_fields": {
      "title_en": "Does Saturday work for you?",
      "title_ja": "土曜日で都合はいいですか？",
      "content": {
        "phrase": "Does Saturday work for you?",
        "japanese": "土曜日で都合はいいですか？",
        "situation": "会う日程を調整するとき",
        "naturalUsage": "work for you は「あなたにとって都合がよい」という会話表現です。",
        "exampleDialogue": "A: Does Saturday work for you? B: Saturday is perfect.",
        "commonMistake": "Is Saturday working for you? より、日程確認には Does Saturday work for you? が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "scheduling",
        "plans",
        "question"
      ]
    },
    "after_fields": {
      "title_en": "Does Saturday work for you?",
      "title_ja": "土曜日で都合はいいですか？",
      "content": {
        "phrase": "Does Saturday work for you?",
        "japanese": "土曜日で都合はいいですか？",
        "situation": "会う日程を調整するとき",
        "naturalUsage": "work for you は「あなたにとって都合がよい」という会話表現です。",
        "exampleDialogue": "A: Does Saturday work for you? B: Saturday is perfect.",
        "commonMistake": "Is Saturday working for you? より、日程確認には Does Saturday work for you? が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-59681503896f7ce0.svg",
          "kind": "scene",
          "altEn": "Two people check their calendars and see whether Saturday suits both of them.",
          "altJa": "会う日を調整。会う日程を調整する場面。",
          "sceneEn": "Choosing a meeting day",
          "sceneJa": "会う日を調整"
        }
      },
      "icon": "",
      "tags": [
        "scheduling",
        "plans",
        "question"
      ]
    }
  },
  {
    "id": "phrase-l14-04",
    "category": "phrases",
    "level": 14,
    "before_fields": {
      "title_en": "I'll let you know tonight.",
      "title_ja": "今夜連絡します。",
      "content": {
        "phrase": "I'll let you know tonight.",
        "japanese": "今夜連絡します。",
        "situation": "すぐに決められず、あとで返事をするとき",
        "naturalUsage": "確認後に情報や決定を伝える約束として使います。",
        "exampleDialogue": "A: Can you come on Sunday? B: I'll let you know tonight.",
        "commonMistake": "I'll tell you if I know. より、let you know が自然な定型表現です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "plans",
        "follow-up",
        "promise"
      ]
    },
    "after_fields": {
      "title_en": "I'll let you know tonight.",
      "title_ja": "今夜連絡します。",
      "content": {
        "phrase": "I'll let you know tonight.",
        "japanese": "今夜連絡します。",
        "situation": "すぐに決められず、あとで返事をするとき",
        "naturalUsage": "確認後に情報や決定を伝える約束として使います。",
        "exampleDialogue": "A: Can you come on Sunday? B: I'll let you know tonight.",
        "commonMistake": "I'll tell you if I know. より、let you know が自然な定型表現です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-50099640d8f39216.svg",
          "kind": "sequence",
          "altEn": "Someone considers a plan and promises to send a reply tonight.",
          "altJa": "夜までに返事を約束。すぐに決められず、あとで返事をする場面。",
          "sceneEn": "Promising a later reply",
          "sceneJa": "夜までに返事を約束"
        }
      },
      "icon": "",
      "tags": [
        "plans",
        "follow-up",
        "promise"
      ]
    }
  },
  {
    "id": "phrase-l15-01",
    "category": "phrases",
    "level": 15,
    "before_fields": {
      "title_en": "I'd like to check in.",
      "title_ja": "チェックインをお願いします。",
      "content": {
        "phrase": "I'd like to check in.",
        "japanese": "チェックインをお願いします。",
        "situation": "ホテルのフロントで到着手続きをするとき",
        "naturalUsage": "I'd like to ... を使う丁寧で落ち着いた依頼です。",
        "exampleDialogue": "A: How can I help you? B: I'd like to check in.",
        "commonMistake": "I want check in. ではなく、want to または丁寧な I'd like to を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "travel",
        "hotel",
        "request"
      ]
    },
    "after_fields": {
      "title_en": "I'd like to check in.",
      "title_ja": "チェックインをお願いします。",
      "content": {
        "phrase": "I'd like to check in.",
        "japanese": "チェックインをお願いします。",
        "situation": "ホテルのフロントで到着手続きをするとき",
        "naturalUsage": "I'd like to ... を使う丁寧で落ち着いた依頼です。",
        "exampleDialogue": "A: How can I help you? B: I'd like to check in.",
        "commonMistake": "I want check in. ではなく、want to または丁寧な I'd like to を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-762a6b73d7a17972.svg",
          "kind": "scene",
          "altEn": "A traveller arrives with a suitcase and passport and receives a room key.",
          "altJa": "ホテルに到着。ホテルのフロントで到着手続きをする場面。",
          "sceneEn": "Arriving for a hotel stay",
          "sceneJa": "ホテルに到着"
        }
      },
      "icon": "",
      "tags": [
        "travel",
        "hotel",
        "request"
      ]
    }
  },
  {
    "id": "phrase-l15-02",
    "category": "phrases",
    "level": 15,
    "before_fields": {
      "title_en": "Which platform does it leave from?",
      "title_ja": "何番ホームから出ますか？",
      "content": {
        "phrase": "Which platform does it leave from?",
        "japanese": "何番ホームから出ますか？",
        "situation": "電車の出発ホームを確認するとき",
        "naturalUsage": "it は直前に話題にした電車を指し、leave from で出発場所を尋ねます。",
        "exampleDialogue": "A: Which platform does it leave from? B: Platform six.",
        "commonMistake": "Where platform does it leave? ではなく、Which platform ... from? とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "travel",
        "train",
        "directions"
      ]
    },
    "after_fields": {
      "title_en": "Which platform does it leave from?",
      "title_ja": "何番ホームから出ますか？",
      "content": {
        "phrase": "Which platform does it leave from?",
        "japanese": "何番ホームから出ますか？",
        "situation": "電車の出発ホームを確認するとき",
        "naturalUsage": "it は直前に話題にした電車を指し、leave from で出発場所を尋ねます。",
        "exampleDialogue": "A: Which platform does it leave from? B: Platform six.",
        "commonMistake": "Where platform does it leave? ではなく、Which platform ... from? とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-62b1efd4580b12cf.svg",
          "kind": "scene",
          "altEn": "A traveller asks which platform their train leaves from and is directed to platform three.",
          "altJa": "出発ホームを確認。電車の出発ホームを確認する場面。",
          "sceneEn": "Checking a train departure",
          "sceneJa": "出発ホームを確認"
        }
      },
      "icon": "",
      "tags": [
        "travel",
        "train",
        "directions"
      ]
    }
  },
  {
    "id": "phrase-l15-03",
    "category": "phrases",
    "level": 15,
    "before_fields": {
      "title_en": "Is this seat taken?",
      "title_ja": "この席はどなたか使っていますか？",
      "content": {
        "phrase": "Is this seat taken?",
        "japanese": "この席はどなたか使っていますか？",
        "situation": "席を使ってよいか確認するとき",
        "naturalUsage": "電車、カフェ、待合室などで、その席に誰かいるかを丁寧に尋ねます。",
        "exampleDialogue": "A: Is this seat taken? B: No, go ahead.",
        "commonMistake": "Is anyone sitting? だけではどの席か曖昧なため、この定型表現が便利です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "travel",
        "seat",
        "polite"
      ]
    },
    "after_fields": {
      "title_en": "Is this seat taken?",
      "title_ja": "この席はどなたか使っていますか？",
      "content": {
        "phrase": "Is this seat taken?",
        "japanese": "この席はどなたか使っていますか？",
        "situation": "席を使ってよいか確認するとき",
        "naturalUsage": "電車、カフェ、待合室などで、その席に誰かいるかを丁寧に尋ねます。",
        "exampleDialogue": "A: Is this seat taken? B: No, go ahead.",
        "commonMistake": "Is anyone sitting? だけではどの席か曖昧なため、この定型表現が便利です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-49399e197210e059.svg",
          "kind": "scene",
          "altEn": "A diner notices a bag near a chair and checks whether the seat is already taken.",
          "altJa": "座る前に確認。席を使ってよいか確認する場面。",
          "sceneEn": "Checking before sitting",
          "sceneJa": "座る前に確認"
        }
      },
      "icon": "",
      "tags": [
        "travel",
        "seat",
        "polite"
      ]
    }
  },
  {
    "id": "phrase-l15-04",
    "category": "phrases",
    "level": 15,
    "before_fields": {
      "title_en": "Could you recommend somewhere nearby?",
      "title_ja": "近くのおすすめの場所を教えていただけますか？",
      "content": {
        "phrase": "Could you recommend somewhere nearby?",
        "japanese": "近くのおすすめの場所を教えていただけますか？",
        "situation": "近所の店や観光地を教えてもらうとき",
        "naturalUsage": "somewhere nearby で場所の種類を限定せずおすすめを尋ねられます。",
        "exampleDialogue": "A: Could you recommend somewhere nearby? B: There's a nice café around the corner.",
        "commonMistake": "recommend me somewhere より、recommend somewhere to me またはこの形が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "travel",
        "recommendation",
        "local"
      ]
    },
    "after_fields": {
      "title_en": "Could you recommend somewhere nearby?",
      "title_ja": "近くのおすすめの場所を教えていただけますか？",
      "content": {
        "phrase": "Could you recommend somewhere nearby?",
        "japanese": "近くのおすすめの場所を教えていただけますか？",
        "situation": "食事をする場所など、目的を伝えてから近くのおすすめを聞くとき",
        "naturalUsage": "食事・買い物などの目的を先に共有すると、somewhere nearby がどんな場所を指すか伝わります。",
        "exampleDialogue": "A: We're looking for lunch. Could you recommend somewhere nearby? B: There's a nice café around the corner.",
        "commonMistake": "recommend me somewhere より、recommend somewhere to me またはこの形が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-8f6ed2a4a8881002.svg",
          "kind": "scene",
          "altEn": "A visitor asks someone local to recommend a nearby place to eat.",
          "altJa": "近くのおすすめを聞く。食事をする場所など、目的を伝えてから近くのおすすめを聞く場面。",
          "sceneEn": "Asking for a nearby recommendation",
          "sceneJa": "近くのおすすめを聞く"
        }
      },
      "icon": "",
      "tags": [
        "travel",
        "recommendation",
        "local"
      ]
    }
  },
  {
    "id": "phrase-l16-01",
    "category": "phrases",
    "level": 16,
    "before_fields": {
      "title_en": "Something seems to be wrong.",
      "title_ja": "何か問題があるようです。",
      "content": {
        "phrase": "Something seems to be wrong.",
        "japanese": "何か問題があるようです。",
        "situation": "原因は不明だが正常ではないと伝えるとき",
        "naturalUsage": "断定を避けながら問題を知らせる、穏やかな表現です。",
        "exampleDialogue": "A: Why won't the screen turn on? B: Something seems to be wrong.",
        "commonMistake": "Something is wrong. より控えめに言いたいときは seems to be を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "problem",
        "uncertainty",
        "technology"
      ]
    },
    "after_fields": {
      "title_en": "Something seems to be wrong.",
      "title_ja": "何か問題があるようです。",
      "content": {
        "phrase": "Something seems to be wrong.",
        "japanese": "何か問題があるようです。",
        "situation": "原因は不明だが正常ではないと伝えるとき",
        "naturalUsage": "断定を避けながら問題を知らせる、穏やかな表現です。",
        "exampleDialogue": "A: Why won't the screen turn on? B: Something seems to be wrong.",
        "commonMistake": "Something is wrong. より控えめに言いたいときは seems to be を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-f02f025476e8c9e4.svg",
          "kind": "scene",
          "altEn": "An unexpected warning on a computer screen makes its user concerned.",
          "altJa": "異変に気づく。原因は不明だが正常ではないと伝える場面。",
          "sceneEn": "Noticing a problem",
          "sceneJa": "異変に気づく"
        }
      },
      "icon": "",
      "tags": [
        "problem",
        "uncertainty",
        "technology"
      ]
    }
  },
  {
    "id": "phrase-l16-02",
    "category": "phrases",
    "level": 16,
    "before_fields": {
      "title_en": "I can't get this to work.",
      "title_ja": "どうしてもこれがうまく動きません。",
      "content": {
        "phrase": "I can't get this to work.",
        "japanese": "どうしてもこれがうまく動きません。",
        "situation": "機械やアプリがうまく動かないとき",
        "naturalUsage": "試しているのに期待どおり作動しない状況を表します。",
        "exampleDialogue": "A: Is the printer ready? B: No, I can't get this to work.",
        "commonMistake": "I can't make this working. ではなく、get this to work と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "problem",
        "technology",
        "help"
      ]
    },
    "after_fields": {
      "title_en": "I can't get this to work.",
      "title_ja": "どうしてもこれがうまく動きません。",
      "content": {
        "phrase": "I can't get this to work.",
        "japanese": "どうしてもこれがうまく動きません。",
        "situation": "機械やアプリがうまく動かないとき",
        "naturalUsage": "試しているのに期待どおり作動しない状況を表します。",
        "exampleDialogue": "A: Is the printer ready? B: No, I can't get this to work.",
        "commonMistake": "I can't make this working. ではなく、get this to work と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-b4d8609873a16bf0.svg",
          "kind": "sequence",
          "altEn": "Someone presses a computer button but gets no response and checks its plug.",
          "altJa": "機械がうまく動かない。機械やアプリがうまく動かない場面。",
          "sceneEn": "A device that will not work",
          "sceneJa": "機械がうまく動かない"
        }
      },
      "icon": "",
      "tags": [
        "problem",
        "technology",
        "help"
      ]
    }
  },
  {
    "id": "phrase-l16-03",
    "category": "phrases",
    "level": 16,
    "before_fields": {
      "title_en": "I may have misunderstood.",
      "title_ja": "私が勘違いしたかもしれません。",
      "content": {
        "phrase": "I may have misunderstood.",
        "japanese": "私が勘違いしたかもしれません。",
        "situation": "説明の理解が違っていた可能性を認めるとき",
        "naturalUsage": "相手を責めず、自分側の誤解として丁寧に確認できます。",
        "exampleDialogue": "A: The meeting starts at three. B: Oh, I may have misunderstood.",
        "commonMistake": "I might misunderstand. だとこれから誤解する可能性にも聞こえるため、過去は may have misunderstood です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "misunderstanding",
        "polite",
        "problem"
      ]
    },
    "after_fields": {
      "title_en": "I may have misunderstood.",
      "title_ja": "私が勘違いしたかもしれません。",
      "content": {
        "phrase": "I may have misunderstood.",
        "japanese": "私が勘違いしたかもしれません。",
        "situation": "説明の理解が違っていた可能性を認めるとき",
        "naturalUsage": "相手を責めず、自分側の誤解として丁寧に確認できます。",
        "exampleDialogue": "A: The meeting starts at three. B: Oh, I may have misunderstood.",
        "commonMistake": "I might misunderstand. だとこれから誤解する可能性にも聞こえるため、過去は may have misunderstood です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-b395246114a40e2e.svg",
          "kind": "contrast",
          "altEn": "Someone realises they understood a calendar date incorrectly and revises their understanding.",
          "altJa": "聞き間違いに気づく。説明の理解が違っていた可能性を認める場面。",
          "sceneEn": "Correcting a misunderstanding",
          "sceneJa": "聞き間違いに気づく"
        }
      },
      "icon": "",
      "tags": [
        "misunderstanding",
        "polite",
        "problem"
      ]
    }
  },
  {
    "id": "phrase-l16-04",
    "category": "phrases",
    "level": 16,
    "before_fields": {
      "title_en": "Could you take a look?",
      "title_ja": "ちょっと見てもらえますか？",
      "content": {
        "phrase": "Could you take a look?",
        "japanese": "ちょっと見てもらえますか？",
        "situation": "問題や作業内容を確認してほしいとき",
        "naturalUsage": "詳しい説明のあとに、相手へ確認や助けを頼む自然な表現です。",
        "exampleDialogue": "A: This file won't open. Could you take a look? B: Sure.",
        "commonMistake": "look it ではなく、look at it または take a look と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "help",
        "request",
        "problem"
      ]
    },
    "after_fields": {
      "title_en": "Could you take a look?",
      "title_ja": "ちょっと見てもらえますか？",
      "content": {
        "phrase": "Could you take a look?",
        "japanese": "ちょっと見てもらえますか？",
        "situation": "問題や作業内容を確認してほしいとき",
        "naturalUsage": "詳しい説明のあとに、相手へ確認や助けを頼む自然な表現です。",
        "exampleDialogue": "A: This file won't open. Could you take a look? B: Sure.",
        "commonMistake": "look it ではなく、look at it または take a look と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-7a713537cd3aa042.svg",
          "kind": "scene",
          "altEn": "A person shows a draft on paper and asks someone to look it over.",
          "altJa": "作業内容を見てもらう。問題や作業内容を確認してほしい場面。",
          "sceneEn": "Asking someone to inspect work",
          "sceneJa": "作業内容を見てもらう"
        }
      },
      "icon": "",
      "tags": [
        "help",
        "request",
        "problem"
      ]
    }
  },
  {
    "id": "phrase-l17-01",
    "category": "phrases",
    "level": 17,
    "before_fields": {
      "title_en": "In my opinion, it's worth trying.",
      "title_ja": "私の意見では、試す価値があります。",
      "content": {
        "phrase": "In my opinion, it's worth trying.",
        "japanese": "私の意見では、試す価値があります。",
        "situation": "自分の考えを明確に述べるとき",
        "naturalUsage": "意見であることを示してから、worth + 動名詞で価値を伝えます。",
        "exampleDialogue": "A: Should we use the new app? B: In my opinion, it's worth trying.",
        "commonMistake": "worth to try ではなく、worth trying とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "opinion",
        "recommendation",
        "discussion"
      ]
    },
    "after_fields": {
      "title_en": "I think it's worth a try.",
      "title_ja": "試してみる価値はあると思います。",
      "content": {
        "phrase": "I think it's worth a try.",
        "japanese": "試してみる価値はあると思います。",
        "situation": "自分の考えを明確に述べるとき",
        "naturalUsage": "I think で意見をやわらかく伝えます。worth a try は、結果は分からなくても試す価値があるという自然な会話表現です。",
        "exampleDialogue": "A: Should we use the new app? B: I think it's worth a try.",
        "commonMistake": "worth a try と worth trying はどちらも自然です。worth to try とは言いません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-efd2ab83d954c3c5.svg",
          "kind": "sequence",
          "altEn": "An idea is tested by building a small model to see whether it works.",
          "altJa": "小さく試してみる提案。自分の考えを明確に述べる場面。",
          "sceneEn": "Considering a practical experiment",
          "sceneJa": "小さく試してみる提案"
        }
      },
      "icon": "",
      "tags": [
        "opinion",
        "recommendation",
        "discussion"
      ]
    }
  },
  {
    "id": "phrase-l17-02",
    "category": "phrases",
    "level": 17,
    "before_fields": {
      "title_en": "I see what you mean.",
      "title_ja": "言いたいことは分かります。",
      "content": {
        "phrase": "I see what you mean.",
        "japanese": "言いたいことは分かります。",
        "situation": "相手の考えを理解したと示すとき",
        "naturalUsage": "完全な賛成とは限らず、まず相手の視点を受け止める表現です。",
        "exampleDialogue": "A: The first option is simpler. B: I see what you mean.",
        "commonMistake": "I know what you mean. も使えますが、議論では I see ... が理解の変化を自然に示します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "understanding",
        "opinion",
        "discussion"
      ]
    },
    "after_fields": {
      "title_en": "I see what you mean.",
      "title_ja": "言いたいことは分かります。",
      "content": {
        "phrase": "I see what you mean.",
        "japanese": "言いたいことは分かります。",
        "situation": "相手の考えを理解したと示すとき",
        "naturalUsage": "完全な賛成とは限らず、まず相手の視点を受け止める表現です。",
        "exampleDialogue": "A: The first option is simpler. B: I see what you mean.",
        "commonMistake": "I know what you mean. も使えますが、議論では I see ... が理解の変化を自然に示します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-5bcf973994a6e720.svg",
          "kind": "scene",
          "altEn": "A listener follows a road explanation and understands where to turn right.",
          "altJa": "道順の説明に納得。相手の考えを理解したと示す場面。",
          "sceneEn": "Understanding a route explanation",
          "sceneJa": "道順の説明に納得"
        }
      },
      "icon": "",
      "tags": [
        "understanding",
        "opinion",
        "discussion"
      ]
    }
  },
  {
    "id": "phrase-l17-03",
    "category": "phrases",
    "level": 17,
    "before_fields": {
      "title_en": "I completely agree with you.",
      "title_ja": "あなたにまったく同感です。",
      "content": {
        "phrase": "I completely agree with you.",
        "japanese": "あなたにまったく同感です。",
        "situation": "相手の意見に強く賛成するとき",
        "naturalUsage": "with you を添えて、誰の意見に賛成かを示します。",
        "exampleDialogue": "A: We need more time to practice. B: I completely agree with you.",
        "commonMistake": "I agree you. ではなく、agree with you と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "agreement",
        "opinion",
        "emphasis"
      ]
    },
    "after_fields": {
      "title_en": "I completely agree with you.",
      "title_ja": "あなたにまったく同感です。",
      "content": {
        "phrase": "I completely agree with you.",
        "japanese": "あなたにまったく同感です。",
        "situation": "相手の意見に強く賛成するとき",
        "naturalUsage": "with you を添えて、誰の意見に賛成かを示します。",
        "exampleDialogue": "A: We need more time to practice. B: I completely agree with you.",
        "commonMistake": "I agree you. ではなく、agree with you と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-e4e7fba7488035de.svg",
          "kind": "scene",
          "altEn": "Two colleagues compare their views and recognise that they agree.",
          "altJa": "共通の意見に賛成。相手の意見に強く賛成する場面。",
          "sceneEn": "Agreeing on a shared choice",
          "sceneJa": "共通の意見に賛成"
        }
      },
      "icon": "",
      "tags": [
        "agreement",
        "opinion",
        "emphasis"
      ]
    }
  },
  {
    "id": "phrase-l17-04",
    "category": "phrases",
    "level": 17,
    "before_fields": {
      "title_en": "I'm not convinced yet.",
      "title_ja": "まだ納得していません。",
      "content": {
        "phrase": "I'm not convinced yet.",
        "japanese": "まだ納得していません。",
        "situation": "説明を聞いても判断が変わっていないとき",
        "naturalUsage": "強い否定を避けつつ、追加の根拠が必要だと伝えられます。",
        "exampleDialogue": "A: This plan will save money. B: I'm not convinced yet.",
        "commonMistake": "I'm not convincing. は自分に説得力がないという意味になるため、convinced を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "disagreement",
        "opinion",
        "softening"
      ]
    },
    "after_fields": {
      "title_en": "I'm not convinced yet.",
      "title_ja": "まだ納得していません。",
      "content": {
        "phrase": "I'm not convinced yet.",
        "japanese": "まだ納得していません。",
        "situation": "説明を聞いても判断が変わっていないとき",
        "naturalUsage": "強い否定を避けつつ、追加の根拠が必要だと伝えられます。",
        "exampleDialogue": "A: This plan will save money. B: I'm not convinced yet.",
        "commonMistake": "I'm not convincing. は自分に説得力がないという意味になるため、convinced を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-186e2bca2b774a6f.svg",
          "kind": "contrast",
          "altEn": "A colleague reviews a written proposal but still has questions about the evidence.",
          "altJa": "まだ判断を保留。説明を聞いても判断が変わっていない場面。",
          "sceneEn": "Still considering the evidence",
          "sceneJa": "まだ判断を保留"
        }
      },
      "icon": "",
      "tags": [
        "disagreement",
        "opinion",
        "softening"
      ]
    }
  },
  {
    "id": "phrase-l18-01",
    "category": "phrases",
    "level": 18,
    "before_fields": {
      "title_en": "Why don't we start with the easiest part?",
      "title_ja": "一番簡単な部分から始めませんか？",
      "content": {
        "phrase": "Why don't we start with the easiest part?",
        "japanese": "一番簡単な部分から始めませんか？",
        "situation": "作業の進め方を提案するとき",
        "naturalUsage": "Why don't we ...? は仲間に提案する自然な疑問文です。",
        "exampleDialogue": "A: This project feels huge. B: Why don't we start with the easiest part?",
        "commonMistake": "Why we don't start ...? ではなく、Why don't we start ...? の語順です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "suggestion",
        "teamwork",
        "planning"
      ]
    },
    "after_fields": {
      "title_en": "Why don't we start with the easiest part?",
      "title_ja": "一番簡単な部分から始めませんか？",
      "content": {
        "phrase": "Why don't we start with the easiest part?",
        "japanese": "一番簡単な部分から始めませんか？",
        "situation": "作業の進め方を提案するとき",
        "naturalUsage": "Why don't we ...? は仲間に提案する自然な疑問文です。",
        "exampleDialogue": "A: This project feels huge. B: Why don't we start with the easiest part?",
        "commonMistake": "Why we don't start ...? ではなく、Why don't we start ...? の語順です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-66e75d7d05d5228e.svg",
          "kind": "sequence",
          "altEn": "A team starts with one easy puzzle piece before tackling the whole puzzle.",
          "altJa": "簡単な作業から始める。作業の進め方を提案する場面。",
          "sceneEn": "Beginning with an easy step",
          "sceneJa": "簡単な作業から始める"
        }
      },
      "icon": "",
      "tags": [
        "suggestion",
        "teamwork",
        "planning"
      ]
    }
  },
  {
    "id": "phrase-l18-02",
    "category": "phrases",
    "level": 18,
    "before_fields": {
      "title_en": "We could give it another day.",
      "title_ja": "もう一日様子を見てもいいかもしれません。",
      "content": {
        "phrase": "We could give it another day.",
        "japanese": "もう一日様子を見てもいいかもしれません。",
        "situation": "決定を急がず待つ案を出すとき",
        "naturalUsage": "could を使い、押しつけず選択肢として提案します。",
        "exampleDialogue": "A: Should we decide now? B: We could give it another day.",
        "commonMistake": "give another day it ではなく、give it another day の順にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "suggestion",
        "decision",
        "time"
      ]
    },
    "after_fields": {
      "title_en": "We could give it another day.",
      "title_ja": "もう一日様子を見てもいいかもしれません。",
      "content": {
        "phrase": "We could give it another day.",
        "japanese": "もう一日様子を見てもいいかもしれません。",
        "situation": "決定を急がず待つ案を出すとき",
        "naturalUsage": "could を使い、押しつけず選択肢として提案します。",
        "exampleDialogue": "A: Should we decide now? B: We could give it another day.",
        "commonMistake": "give another day it ではなく、give it another day の順にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-20382067e6a58fad.svg",
          "kind": "sequence",
          "altEn": "Someone checking a plant suggests waiting one more day before deciding what to do.",
          "altJa": "判断をもう一日待つ。決定を急がず待つ案を出す場面。",
          "sceneEn": "Allowing more time",
          "sceneJa": "判断をもう一日待つ"
        }
      },
      "icon": "",
      "tags": [
        "suggestion",
        "decision",
        "time"
      ]
    }
  },
  {
    "id": "phrase-l18-03",
    "category": "phrases",
    "level": 18,
    "before_fields": {
      "title_en": "Let's think it over.",
      "title_ja": "よく考えてみましょう。",
      "content": {
        "phrase": "Let's think it over.",
        "japanese": "よく考えてみましょう。",
        "situation": "結論を出す前に検討する時間を取りたいとき",
        "naturalUsage": "think over は選択肢や提案を慎重に検討するという意味です。",
        "exampleDialogue": "A: Do we have to answer today? B: No, let's think it over.",
        "commonMistake": "代名詞 it は think と over の間に置きます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "decision",
        "reflection",
        "phrasal-verb"
      ]
    },
    "after_fields": {
      "title_en": "Let's think it over.",
      "title_ja": "よく考えてみましょう。",
      "content": {
        "phrase": "Let's think it over.",
        "japanese": "よく考えてみましょう。",
        "situation": "結論を出す前に検討する時間を取りたいとき",
        "naturalUsage": "think over は選択肢や提案を慎重に検討するという意味です。",
        "exampleDialogue": "A: Do we have to answer today? B: No, let's think it over.",
        "commonMistake": "代名詞 it は think と over の間に置きます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-1a443f2738644006.svg",
          "kind": "scene",
          "altEn": "A person gives a written proposal careful thought instead of deciding immediately.",
          "altJa": "結論の前によく考える。結論を出す前に検討する時間を取りたい場面。",
          "sceneEn": "Considering a decision carefully",
          "sceneJa": "結論の前によく考える"
        }
      },
      "icon": "",
      "tags": [
        "decision",
        "reflection",
        "phrasal-verb"
      ]
    }
  },
  {
    "id": "phrase-l18-04",
    "category": "phrases",
    "level": 18,
    "before_fields": {
      "title_en": "That seems like the best option.",
      "title_ja": "それが最善の選択肢のようです。",
      "content": {
        "phrase": "That seems like the best option.",
        "japanese": "それが最善の選択肢のようです。",
        "situation": "比較したあとで有力な案を示すとき",
        "naturalUsage": "seems like を使うことで、断定しすぎない判断になります。",
        "exampleDialogue": "A: We can take the earlier train. B: That seems like the best option.",
        "commonMistake": "That seems the best option. も可能ですが、会話では seems like が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "decision",
        "opinion",
        "choice"
      ]
    },
    "after_fields": {
      "title_en": "That seems like the best option.",
      "title_ja": "それが最善の選択肢のようです。",
      "content": {
        "phrase": "That seems like the best option.",
        "japanese": "それが最善の選択肢のようです。",
        "situation": "比較したあとで有力な案を示すとき",
        "naturalUsage": "seems like を使うことで、断定しすぎない判断になります。",
        "exampleDialogue": "A: We can take the earlier train. B: That seems like the best option.",
        "commonMistake": "That seems the best option. も可能ですが、会話では seems like が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-94e5673236642546.svg",
          "kind": "contrast",
          "altEn": "Several purchase options are compared against a budget and the best is selected.",
          "altJa": "比較して最善案を選ぶ。比較したあとで有力な案を示す場面。",
          "sceneEn": "Selecting the best of several options",
          "sceneJa": "比較して最善案を選ぶ"
        }
      },
      "icon": "",
      "tags": [
        "decision",
        "opinion",
        "choice"
      ]
    }
  },
  {
    "id": "phrase-l19-01",
    "category": "phrases",
    "level": 19,
    "before_fields": {
      "title_en": "Could you say that another way?",
      "title_ja": "別の言い方で言っていただけますか？",
      "content": {
        "phrase": "Could you say that another way?",
        "japanese": "別の言い方で言っていただけますか？",
        "situation": "同じ説明を別の表現で聞きたいとき",
        "naturalUsage": "単なる繰り返しではなく、言い換えをお願いする表現です。",
        "exampleDialogue": "A: The result was inconclusive. B: Could you say that another way?",
        "commonMistake": "Say again は繰り返し、say that another way は言い換えを求めます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "clarification",
        "listening",
        "conversation-repair"
      ]
    },
    "after_fields": {
      "title_en": "Could you say that another way?",
      "title_ja": "別の言い方で言っていただけますか？",
      "content": {
        "phrase": "Could you say that another way?",
        "japanese": "別の言い方で言っていただけますか？",
        "situation": "同じ説明を別の表現で聞きたいとき",
        "naturalUsage": "単なる繰り返しではなく、言い換えをお願いする表現です。",
        "exampleDialogue": "A: The result was inconclusive. B: Could you say that another way?",
        "commonMistake": "Say again は繰り返し、say that another way は言い換えを求めます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-732a2d54124a3c1d.svg",
          "kind": "contrast",
          "altEn": "A learner asks a speaker to explain the same idea again using an example.",
          "altJa": "別の説明をお願い。同じ説明を別の表現で聞きたい場面。",
          "sceneEn": "Requesting a different explanation",
          "sceneJa": "別の説明をお願い"
        }
      },
      "icon": "",
      "tags": [
        "clarification",
        "listening",
        "conversation-repair"
      ]
    }
  },
  {
    "id": "phrase-l19-02",
    "category": "phrases",
    "level": 19,
    "before_fields": {
      "title_en": "What exactly do you mean?",
      "title_ja": "具体的にはどういう意味ですか？",
      "content": {
        "phrase": "What exactly do you mean?",
        "japanese": "具体的にはどういう意味ですか？",
        "situation": "相手の意図をより正確に確認するとき",
        "naturalUsage": "exactly を強く言いすぎると詰問調になるため、穏やかな声で使います。",
        "exampleDialogue": "A: We may need to change the format. B: What exactly do you mean?",
        "commonMistake": "What do you mean exactly? も自然ですが、語調によっては強く聞こえる点に注意します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "clarification",
        "meaning",
        "question"
      ]
    },
    "after_fields": {
      "title_en": "What exactly do you mean?",
      "title_ja": "具体的にはどういう意味ですか？",
      "content": {
        "phrase": "What exactly do you mean?",
        "japanese": "具体的にはどういう意味ですか？",
        "situation": "相手の意図をより正確に確認するとき",
        "naturalUsage": "exactly を強く言いすぎると詰問調になるため、穏やかな声で使います。",
        "exampleDialogue": "A: We may need to change the format. B: What exactly do you mean?",
        "commonMistake": "What do you mean exactly? も自然ですが、語調によっては強く聞こえる点に注意します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-bf40ba1d080b3c9b.svg",
          "kind": "scene",
          "altEn": "Two colleagues look closely at one sentence in a document to clarify its meaning.",
          "altJa": "意味を具体的に確認。相手の意図をより正確に確認する場面。",
          "sceneEn": "Clarifying an exact meaning",
          "sceneJa": "意味を具体的に確認"
        }
      },
      "icon": "",
      "tags": [
        "clarification",
        "meaning",
        "question"
      ]
    }
  },
  {
    "id": "phrase-l19-03",
    "category": "phrases",
    "level": 19,
    "before_fields": {
      "title_en": "Let me make sure I understood.",
      "title_ja": "理解できているか確認させてください。",
      "content": {
        "phrase": "Let me make sure I understood.",
        "japanese": "理解できているか確認させてください。",
        "situation": "聞いた内容を自分の言葉で確認する前",
        "naturalUsage": "大事な情報の認識違いを防ぐ、丁寧な会話のつなぎです。",
        "exampleDialogue": "A: Send the draft by noon. B: Let me make sure I understood. You need it before lunch, right?",
        "commonMistake": "make sure のあとには内容を表す節を続けます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "clarification",
        "confirmation",
        "listening"
      ]
    },
    "after_fields": {
      "title_en": "Let me make sure I understood.",
      "title_ja": "理解できているか確認させてください。",
      "content": {
        "phrase": "Let me make sure I understood.",
        "japanese": "理解できているか確認させてください。",
        "situation": "聞いた内容を自分の言葉で確認する前",
        "naturalUsage": "大事な情報の認識違いを防ぐ、丁寧な会話のつなぎです。",
        "exampleDialogue": "A: Send the draft by noon. B: Let me make sure I understood. You need it by twelve, right?",
        "commonMistake": "make sure のあとには内容を表す節を続けます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-9eb40c5c88429440.svg",
          "kind": "sequence",
          "altEn": "A listener checks their notes and restates what they understood.",
          "altJa": "理解した内容を確認。聞いた内容を自分の言葉で確認する前の場面。",
          "sceneEn": "Checking understanding aloud",
          "sceneJa": "理解した内容を確認"
        }
      },
      "icon": "",
      "tags": [
        "clarification",
        "confirmation",
        "listening"
      ]
    }
  },
  {
    "id": "phrase-l19-04",
    "category": "phrases",
    "level": 19,
    "before_fields": {
      "title_en": "I didn't catch the last part.",
      "title_ja": "最後の部分が聞き取れませんでした。",
      "content": {
        "phrase": "I didn't catch the last part.",
        "japanese": "最後の部分が聞き取れませんでした。",
        "situation": "発言の終わりだけ聞こえなかったとき",
        "naturalUsage": "catch はここでは音や言葉を聞き取るという意味です。",
        "exampleDialogue": "A: Meet me beside the north entrance. B: Sorry, I didn't catch the last part.",
        "commonMistake": "I couldn't hear the last part. も正しいですが、didn't catch は聞き返しでよく使われます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "clarification",
        "listening",
        "conversation-repair"
      ]
    },
    "after_fields": {
      "title_en": "I didn't catch the last part.",
      "title_ja": "最後の部分が聞き取れませんでした。",
      "content": {
        "phrase": "I didn't catch the last part.",
        "japanese": "最後の部分が聞き取れませんでした。",
        "situation": "発言の終わりだけ聞こえなかったとき",
        "naturalUsage": "catch はここでは音や言葉を聞き取るという意味です。",
        "exampleDialogue": "A: Meet me beside the north entrance. B: Sorry, I didn't catch the last part.",
        "commonMistake": "I couldn't hear the last part. も正しいですが、didn't catch は聞き返しでよく使われます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-69c07f9ea42f6702.svg",
          "kind": "sequence",
          "altEn": "A learner requests that only the missed end of an explanation be repeated.",
          "altJa": "聞き逃した最後を確認。発言の終わりだけ聞こえなかった場面。",
          "sceneEn": "Recovering the missed ending",
          "sceneJa": "聞き逃した最後を確認"
        }
      },
      "icon": "",
      "tags": [
        "clarification",
        "listening",
        "conversation-repair"
      ]
    }
  },
  {
    "id": "phrase-l20-01",
    "category": "phrases",
    "level": 20,
    "before_fields": {
      "title_en": "I'll get back to you by Friday.",
      "title_ja": "金曜日までにお返事します。",
      "content": {
        "phrase": "I'll get back to you by Friday.",
        "japanese": "金曜日までにお返事します。",
        "situation": "確認後の返答期限を伝えるとき",
        "naturalUsage": "仕事や学校の連絡で、いつ返事をするか明確にできます。",
        "exampleDialogue": "A: Can you confirm the numbers? B: I'll get back to you by Friday.",
        "commonMistake": "until Friday は金曜まで継続する意味で、締切には by Friday を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "work",
        "follow-up",
        "deadline"
      ]
    },
    "after_fields": {
      "title_en": "I'll get back to you by Friday.",
      "title_ja": "金曜日までにお返事します。",
      "content": {
        "phrase": "I'll get back to you by Friday.",
        "japanese": "金曜日までにお返事します。",
        "situation": "確認後の返答期限を伝えるとき",
        "naturalUsage": "仕事や学校の連絡で、いつ返事をするか明確にできます。",
        "exampleDialogue": "A: Can you confirm the numbers? B: I'll get back to you by Friday.",
        "commonMistake": "until Friday は金曜まで継続する意味で、締切には by Friday を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-e16dedae022eac41.svg",
          "kind": "sequence",
          "altEn": "A colleague marks Friday on the calendar and prepares to send a considered reply by then.",
          "altJa": "返事の期限を約束。確認後の返答期限を伝える場面。",
          "sceneEn": "Giving a reply deadline",
          "sceneJa": "返事の期限を約束"
        }
      },
      "icon": "",
      "tags": [
        "work",
        "follow-up",
        "deadline"
      ]
    }
  },
  {
    "id": "phrase-l20-02",
    "category": "phrases",
    "level": 20,
    "before_fields": {
      "title_en": "Could we move the meeting to three?",
      "title_ja": "会議を3時に変更できますか？",
      "content": {
        "phrase": "Could we move the meeting to three?",
        "japanese": "会議を3時に変更できますか？",
        "situation": "予定時刻の変更を相談するとき",
        "naturalUsage": "move ... to ... で予定を別の時刻へ動かすことを表します。",
        "exampleDialogue": "A: Could we move the meeting to three? B: Three works for me.",
        "commonMistake": "move the meeting at three ではなく、変更先には to three を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "work",
        "scheduling",
        "request"
      ]
    },
    "after_fields": {
      "title_en": "Could we move the meeting to three?",
      "title_ja": "会議を3時に変更できますか？",
      "content": {
        "phrase": "Could we move the meeting to three?",
        "japanese": "会議を3時に変更できますか？",
        "situation": "予定時刻の変更を相談するとき",
        "naturalUsage": "move ... to ... で予定を別の時刻へ動かすことを表します。",
        "exampleDialogue": "A: Could we move the meeting to three? B: Three works for me.",
        "commonMistake": "move the meeting at three ではなく、変更先には to three を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-f1f11d0c2058422a.svg",
          "kind": "contrast",
          "altEn": "A meeting time is moved from its original clock slot to three o'clock.",
          "altJa": "会議時刻を変更。予定時刻の変更を相談する場面。",
          "sceneEn": "Moving a meeting time",
          "sceneJa": "会議時刻を変更"
        }
      },
      "icon": "",
      "tags": [
        "work",
        "scheduling",
        "request"
      ]
    }
  },
  {
    "id": "phrase-l20-03",
    "category": "phrases",
    "level": 20,
    "before_fields": {
      "title_en": "I'm running a little behind.",
      "title_ja": "少し予定より遅れています。",
      "content": {
        "phrase": "I'm running a little behind.",
        "japanese": "少し予定より遅れています。",
        "situation": "到着や作業が遅れていると連絡するとき",
        "naturalUsage": "late と断定する前でも、予定より遅れ気味なら使えます。",
        "exampleDialogue": "A: Are you almost here? B: I'm running a little behind.",
        "commonMistake": "I'm running late は明確な遅刻、running behind は予定からの遅れを広く表します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "work",
        "delay",
        "scheduling"
      ]
    },
    "after_fields": {
      "title_en": "I'm running a little behind.",
      "title_ja": "少し予定より遅れています。",
      "content": {
        "phrase": "I'm running a little behind.",
        "japanese": "少し予定より遅れています。",
        "situation": "到着や作業が遅れていると連絡するとき",
        "naturalUsage": "late と断定する前でも、予定より遅れ気味なら使えます。",
        "exampleDialogue": "A: Are you almost here? B: I'm running a little behind.",
        "commonMistake": "running late も running behind も、予定より遅れているときに使えます。状況が不明なら behind schedule と補えます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-b47d55c1bf64d938.svg",
          "kind": "scene",
          "altEn": "A traveller delayed by a missed bus phones ahead to explain they are running late.",
          "altJa": "遅れを連絡。到着や作業が遅れていると連絡する場面。",
          "sceneEn": "Reporting a delay",
          "sceneJa": "遅れを連絡"
        }
      },
      "icon": "",
      "tags": [
        "work",
        "delay",
        "scheduling"
      ]
    }
  },
  {
    "id": "phrase-l20-04",
    "category": "phrases",
    "level": 20,
    "before_fields": {
      "title_en": "Let's divide the work evenly.",
      "title_ja": "作業を均等に分けましょう。",
      "content": {
        "phrase": "Let's divide the work evenly.",
        "japanese": "作業を均等に分けましょう。",
        "situation": "チームで担当を決めるとき",
        "naturalUsage": "作業量の偏りを避けたいときの建設的な提案です。",
        "exampleDialogue": "A: There are eight sections. B: Let's divide the work evenly.",
        "commonMistake": "divide the work equally も可能ですが、人ごとの量には evenly が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "teamwork",
        "work",
        "planning"
      ]
    },
    "after_fields": {
      "title_en": "Let's divide the work evenly.",
      "title_ja": "作業を均等に分けましょう。",
      "content": {
        "phrase": "Let's divide the work evenly.",
        "japanese": "作業を均等に分けましょう。",
        "situation": "チームで担当を決めるとき",
        "naturalUsage": "作業量の偏りを避けたいときの建設的な提案です。",
        "exampleDialogue": "A: There are eight sections. B: Let's divide the work evenly.",
        "commonMistake": "evenly と equally は、どちらも作業量を均等に分ける意味で使えます。divide のあとに the work を置きます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-8cfe11dd0e712d1d.svg",
          "kind": "scene",
          "altEn": "A team divides a set of worksheets into equal portions of work.",
          "altJa": "チームの仕事を公平に分担。チームで担当を決める場面。",
          "sceneEn": "Sharing a team task fairly",
          "sceneJa": "チームの仕事を公平に分担"
        }
      },
      "icon": "",
      "tags": [
        "teamwork",
        "work",
        "planning"
      ]
    }
  },
  {
    "id": "phrase-l21-01",
    "category": "phrases",
    "level": 21,
    "before_fields": {
      "title_en": "I hope I'm not interrupting.",
      "title_ja": "お邪魔でなければよいのですが。",
      "content": {
        "phrase": "I hope I'm not interrupting.",
        "japanese": "お邪魔でなければよいのですが。",
        "situation": "忙しそうな人に声をかけるとき",
        "naturalUsage": "用件に入る前に相手への配慮を示すクッション表現です。",
        "exampleDialogue": "A: I hope I'm not interrupting. B: Not at all. What's up?",
        "commonMistake": "I hope I don't interrupt. より、今まさに声をかけている場面では I'm not interrupting が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "politeness",
        "social",
        "softening"
      ]
    },
    "after_fields": {
      "title_en": "I hope I'm not interrupting.",
      "title_ja": "お邪魔でなければよいのですが。",
      "content": {
        "phrase": "I hope I'm not interrupting.",
        "japanese": "お邪魔でなければよいのですが。",
        "situation": "忙しそうな人に声をかけるとき",
        "naturalUsage": "用件に入る前に相手への配慮を示すクッション表現です。",
        "exampleDialogue": "A: I hope I'm not interrupting. B: Not at all. What's up?",
        "commonMistake": "I hope I don't interrupt. より、今まさに声をかけている場面では I'm not interrupting が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-bf4778086f57da0b.svg",
          "kind": "scene",
          "altEn": "A visitor knocks before asking a question of someone busy at a computer.",
          "altJa": "忙しそうな人に声をかける。忙しそうな人に声をかける場面。",
          "sceneEn": "Approaching someone busy",
          "sceneJa": "忙しそうな人に声をかける"
        }
      },
      "icon": "",
      "tags": [
        "politeness",
        "social",
        "softening"
      ]
    }
  },
  {
    "id": "phrase-l21-02",
    "category": "phrases",
    "level": 21,
    "before_fields": {
      "title_en": "No rush—whenever you're ready.",
      "title_ja": "急がなくて大丈夫です。準備ができたときで。",
      "content": {
        "phrase": "No rush—whenever you're ready.",
        "japanese": "急がなくて大丈夫です。準備ができたときで。",
        "situation": "相手を急がせたくないと伝えるとき",
        "naturalUsage": "待てることを伝え、相手のプレッシャーを減らす温かい表現です。",
        "exampleDialogue": "A: I need another minute. B: No rush—whenever you're ready.",
        "commonMistake": "Don't hurry. は命令の響きが出ることがあり、No rush. のほうが柔らかいです。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "reassurance",
        "social",
        "patience"
      ]
    },
    "after_fields": {
      "title_en": "No rush—whenever you're ready.",
      "title_ja": "急がなくて大丈夫です。準備ができたときで。",
      "content": {
        "phrase": "No rush—whenever you're ready.",
        "japanese": "急がなくて大丈夫です。準備ができたときで。",
        "situation": "相手を急がせたくないと伝えるとき",
        "naturalUsage": "待てることを伝え、相手のプレッシャーを減らす温かい表現です。",
        "exampleDialogue": "A: I need another minute. B: No rush—whenever you're ready.",
        "commonMistake": "Don't hurry. は命令の響きが出ることがあり、No rush. のほうが柔らかいです。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-b6d8917024450798.svg",
          "kind": "scene",
          "altEn": "One person calmly waits while another finishes getting ready.",
          "altJa": "相手を急がせず待つ。相手を急がせたくないと伝える場面。",
          "sceneEn": "Letting someone take their time",
          "sceneJa": "相手を急がせず待つ"
        }
      },
      "icon": "",
      "tags": [
        "reassurance",
        "social",
        "patience"
      ]
    }
  },
  {
    "id": "phrase-l21-03",
    "category": "phrases",
    "level": 21,
    "before_fields": {
      "title_en": "It was thoughtful of you to ask.",
      "title_ja": "気にかけて声をかけてくれてありがとう。",
      "content": {
        "phrase": "It was thoughtful of you to ask.",
        "japanese": "気にかけて声をかけてくれてありがとう。",
        "situation": "相手の心づかいに感謝するとき",
        "naturalUsage": "行動そのものだけでなく、その思いやりを評価する表現です。",
        "exampleDialogue": "A: Do you need a ride home? B: I'm okay, but it was thoughtful of you to ask.",
        "commonMistake": "You are thoughtful to ask. より It was thoughtful of you to ask. が自然な構文です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "thanks",
        "kindness",
        "social"
      ]
    },
    "after_fields": {
      "title_en": "It was thoughtful of you to ask.",
      "title_ja": "気にかけて声をかけてくれてありがとう。",
      "content": {
        "phrase": "It was thoughtful of you to ask.",
        "japanese": "気にかけて声をかけてくれてありがとう。",
        "situation": "相手の心づかいに感謝するとき",
        "naturalUsage": "行動そのものだけでなく、その思いやりを評価する表現です。",
        "exampleDialogue": "A: Do you need a ride home? B: I'm okay, but it was thoughtful of you to ask.",
        "commonMistake": "You are thoughtful to ask. より It was thoughtful of you to ask. が自然な構文です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-6ab79b45c6056690.svg",
          "kind": "scene",
          "altEn": "A caring phone call makes someone feel remembered and appreciated.",
          "altJa": "気づかいに感謝。相手の心づかいに感謝する場面。",
          "sceneEn": "Appreciating a caring question",
          "sceneJa": "気づかいに感謝"
        }
      },
      "icon": "",
      "tags": [
        "thanks",
        "kindness",
        "social"
      ]
    }
  },
  {
    "id": "phrase-l21-04",
    "category": "phrases",
    "level": 21,
    "before_fields": {
      "title_en": "I didn't mean to leave you out.",
      "title_ja": "仲間外れにするつもりはありませんでした。",
      "content": {
        "phrase": "I didn't mean to leave you out.",
        "japanese": "仲間外れにするつもりはありませんでした。",
        "situation": "相手を意図せず誘いや話から外してしまったとき",
        "naturalUsage": "意図がなかったことを伝えつつ、相手の気持ちに配慮する謝罪表現です。",
        "exampleDialogue": "A: Everyone knew about the plan except me. B: I'm sorry. I didn't mean to leave you out.",
        "commonMistake": "leave you outside は物理的に外へ残す意味で、仲間外れは leave you out です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "apology",
        "social",
        "relationships"
      ]
    },
    "after_fields": {
      "title_en": "I didn't mean to leave you out.",
      "title_ja": "仲間外れにするつもりはありませんでした。",
      "content": {
        "phrase": "I didn't mean to leave you out.",
        "japanese": "仲間外れにするつもりはありませんでした。",
        "situation": "相手を意図せず誘いや話から外してしまったとき",
        "naturalUsage": "意図がなかったことを伝えつつ、相手の気持ちに配慮する謝罪表現です。",
        "exampleDialogue": "A: Everyone knew about the plan except me. B: I'm sorry. I didn't mean to leave you out.",
        "commonMistake": "leave you outside は物理的に外へ残す意味で、仲間外れは leave you out です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-1cfc0862e576f332.svg",
          "kind": "contrast",
          "altEn": "A friend who was accidentally left out is invited back into the group with an apology.",
          "altJa": "誘い忘れを説明。相手を意図せず誘いや話から外してしまった場面。",
          "sceneEn": "Repairing an accidental exclusion",
          "sceneJa": "誘い忘れを説明"
        }
      },
      "icon": "",
      "tags": [
        "apology",
        "social",
        "relationships"
      ]
    }
  },
  {
    "id": "phrase-l22-01",
    "category": "phrases",
    "level": 22,
    "before_fields": {
      "title_en": "I'm afraid this isn't what I ordered.",
      "title_ja": "すみません、これは注文したものと違うようです。",
      "content": {
        "phrase": "I'm afraid this isn't what I ordered.",
        "japanese": "すみません、これは注文したものと違うようです。",
        "situation": "店で注文と違う品が届いたとき",
        "naturalUsage": "I'm afraid を添えると、問題を丁寧に切り出せます。",
        "exampleDialogue": "A: Is everything okay? B: I'm afraid this isn't what I ordered.",
        "commonMistake": "I'm afraid of this isn't ... とはせず、I'm afraid のあとに文を続けます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "service",
        "complaint",
        "restaurant"
      ]
    },
    "after_fields": {
      "title_en": "I'm afraid this isn't what I ordered.",
      "title_ja": "すみません、これは注文したものと違うようです。",
      "content": {
        "phrase": "I'm afraid this isn't what I ordered.",
        "japanese": "すみません、これは注文したものと違うようです。",
        "situation": "店で注文と違う品が届いたとき",
        "naturalUsage": "I'm afraid を添えると、問題を丁寧に切り出せます。",
        "exampleDialogue": "A: Is everything okay? B: I'm afraid this isn't what I ordered.",
        "commonMistake": "I'm afraid of this isn't ... とはせず、I'm afraid のあとに文を続けます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-45001e242e6b1841.svg",
          "kind": "contrast",
          "altEn": "The meal a diner ordered is contrasted with a different dish that arrived.",
          "altJa": "注文と違う料理が届く。店で注文と違う品が届いた場面。",
          "sceneEn": "Receiving the wrong order",
          "sceneJa": "注文と違う料理が届く"
        }
      },
      "icon": "",
      "tags": [
        "service",
        "complaint",
        "restaurant"
      ]
    }
  },
  {
    "id": "phrase-l22-02",
    "category": "phrases",
    "level": 22,
    "before_fields": {
      "title_en": "Would it be possible to exchange this?",
      "title_ja": "これは交換していただけますか？",
      "content": {
        "phrase": "Would it be possible to exchange this?",
        "japanese": "これは交換していただけますか？",
        "situation": "購入品の交換を丁寧に依頼するとき",
        "naturalUsage": "可能かどうかを尋ねる形で、控えめかつ丁寧に依頼します。",
        "exampleDialogue": "A: Would it be possible to exchange this? B: Do you have the receipt?",
        "commonMistake": "exchange to another one ではなく、exchange this for another one と言えます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "service",
        "exchange",
        "polite-request"
      ]
    },
    "after_fields": {
      "title_en": "Would it be possible to exchange this?",
      "title_ja": "これは交換していただけますか？",
      "content": {
        "phrase": "Would it be possible to exchange this?",
        "japanese": "これは交換していただけますか？",
        "situation": "購入品の交換を丁寧に依頼するとき",
        "naturalUsage": "可能かどうかを尋ねる形で、控えめかつ丁寧に依頼します。",
        "exampleDialogue": "A: Would it be possible to exchange this? B: Do you have the receipt?",
        "commonMistake": "exchange to another one ではなく、exchange this for another one と言えます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-52d1ab51038c934e.svg",
          "kind": "sequence",
          "altEn": "A customer returns clothes that are too small and requests a larger size.",
          "altJa": "買った商品を交換。購入品の交換を丁寧に依頼する場面。",
          "sceneEn": "Exchanging a purchase",
          "sceneJa": "買った商品を交換"
        }
      },
      "icon": "",
      "tags": [
        "service",
        "exchange",
        "polite-request"
      ]
    }
  },
  {
    "id": "phrase-l22-03",
    "category": "phrases",
    "level": 22,
    "before_fields": {
      "title_en": "There seems to be an extra charge.",
      "title_ja": "追加料金がついているようです。",
      "content": {
        "phrase": "There seems to be an extra charge.",
        "japanese": "追加料金がついているようです。",
        "situation": "請求額に心当たりのない料金があるとき",
        "naturalUsage": "mistake と決めつけず、確認を促す穏やかな伝え方です。",
        "exampleDialogue": "A: Is there a problem with the bill? B: There seems to be an extra charge.",
        "commonMistake": "There has an extra charge. ではなく、存在は There is / seems to be で表します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "service",
        "billing",
        "complaint"
      ]
    },
    "after_fields": {
      "title_en": "There seems to be an extra charge.",
      "title_ja": "追加料金がついているようです。",
      "content": {
        "phrase": "There seems to be an extra charge.",
        "japanese": "追加料金がついているようです。",
        "situation": "請求額に心当たりのない料金があるとき",
        "naturalUsage": "mistake と決めつけず、確認を促す穏やかな伝え方です。",
        "exampleDialogue": "A: Is there a problem with the bill? B: There seems to be an extra charge.",
        "commonMistake": "There has an extra charge. ではなく、存在は There is / seems to be で表します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-f190848c784c8cb9.svg",
          "kind": "scene",
          "altEn": "A customer notices an additional amount on a bill and asks the shop to check it.",
          "altJa": "請求の追加料金を確認。請求額に心当たりのない料金がある場面。",
          "sceneEn": "Questioning an extra charge",
          "sceneJa": "請求の追加料金を確認"
        }
      },
      "icon": "",
      "tags": [
        "service",
        "billing",
        "complaint"
      ]
    }
  },
  {
    "id": "phrase-l22-04",
    "category": "phrases",
    "level": 22,
    "before_fields": {
      "title_en": "Thank you for sorting that out.",
      "title_ja": "解決してくださってありがとうございます。",
      "content": {
        "phrase": "Thank you for sorting that out.",
        "japanese": "解決してくださってありがとうございます。",
        "situation": "店員や担当者が問題を解決してくれたとき",
        "naturalUsage": "sort out は問題や混乱をきちんと処理するという意味です。",
        "exampleDialogue": "A: We've removed the incorrect fee. B: Thank you for sorting that out.",
        "commonMistake": "Thank you to sort ... ではなく、Thank you for sorting ... とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "service",
        "thanks",
        "resolution"
      ]
    },
    "after_fields": {
      "title_en": "Thank you for sorting that out.",
      "title_ja": "解決してくださってありがとうございます。",
      "content": {
        "phrase": "Thank you for sorting that out.",
        "japanese": "解決してくださってありがとうございます。",
        "situation": "店員や担当者が問題を解決してくれたとき",
        "naturalUsage": "sort out は問題や混乱をきちんと処理するという意味です。",
        "exampleDialogue": "A: We've removed the incorrect fee. B: Thank you for sorting that out.",
        "commonMistake": "Thank you to sort ... ではなく、Thank you for sorting ... とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-3c5d6fc0c373cbae.svg",
          "kind": "sequence",
          "altEn": "A shop corrects a problem and the customer responds with an appreciative smile.",
          "altJa": "問題解決に感謝。店員や担当者が問題を解決してくれた場面。",
          "sceneEn": "Thanking someone for a fix",
          "sceneJa": "問題解決に感謝"
        }
      },
      "icon": "",
      "tags": [
        "service",
        "thanks",
        "resolution"
      ]
    }
  },
  {
    "id": "phrase-l23-01",
    "category": "phrases",
    "level": 23,
    "before_fields": {
      "title_en": "You won't believe what happened next.",
      "title_ja": "このあと何が起きたか、きっと信じられないよ。",
      "content": {
        "phrase": "You won't believe what happened next.",
        "japanese": "このあと何が起きたか、きっと信じられないよ。",
        "situation": "驚く展開の前に聞き手の興味を引くとき",
        "naturalUsage": "物語の山場へ入る前の、会話的で生き生きしたつなぎです。",
        "exampleDialogue": "A: I finally found my missing phone. You won't believe what happened next. B: Tell me!",
        "commonMistake": "You can't believe ... より、これから話す内容には You won't believe ... が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "storytelling",
        "surprise",
        "narrative"
      ]
    },
    "after_fields": {
      "title_en": "You won't believe what happened next.",
      "title_ja": "このあと何が起きたか、きっと信じられないよ。",
      "content": {
        "phrase": "You won't believe what happened next.",
        "japanese": "このあと何が起きたか、きっと信じられないよ。",
        "situation": "驚く展開の前に聞き手の興味を引くとき",
        "naturalUsage": "物語の山場へ入る前の、会話的で生き生きしたつなぎです。",
        "exampleDialogue": "A: I finally found my missing phone. You won't believe what happened next. B: Tell me!",
        "commonMistake": "You can't believe ... より、これから話す内容には You won't believe ... が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-fcf241d07fa935f2.svg",
          "kind": "sequence",
          "altEn": "A storyteller builds suspense before revealing a surprising celebration.",
          "altJa": "驚く出来事を話す。驚く展開の前に聞き手の興味を引く場面。",
          "sceneEn": "Telling a surprising story",
          "sceneJa": "驚く出来事を話す"
        }
      },
      "icon": "",
      "tags": [
        "storytelling",
        "surprise",
        "narrative"
      ]
    }
  },
  {
    "id": "phrase-l23-02",
    "category": "phrases",
    "level": 23,
    "before_fields": {
      "title_en": "It turned out to be a misunderstanding.",
      "title_ja": "結局、誤解だったと分かりました。",
      "content": {
        "phrase": "It turned out to be a misunderstanding.",
        "japanese": "結局、誤解だったと分かりました。",
        "situation": "出来事の意外な結末を説明するとき",
        "naturalUsage": "turn out to be は、あとで事実が判明した流れを表します。",
        "exampleDialogue": "A: Was your reservation canceled? B: No, it turned out to be a misunderstanding.",
        "commonMistake": "It was turned out ... と受け身にせず、It turned out ... とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "storytelling",
        "outcome",
        "phrasal-verb"
      ]
    },
    "after_fields": {
      "title_en": "It turned out to be a misunderstanding.",
      "title_ja": "結局、誤解だったと分かりました。",
      "content": {
        "phrase": "It turned out to be a misunderstanding.",
        "japanese": "結局、誤解だったと分かりました。",
        "situation": "出来事の意外な結末を説明するとき",
        "naturalUsage": "turn out to be は、あとで事実が判明した流れを表します。",
        "exampleDialogue": "A: Was your reservation canceled? B: No, it turned out to be a misunderstanding.",
        "commonMistake": "It was turned out ... と受け身にせず、It turned out ... とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-ff800188e39b72ce.svg",
          "kind": "sequence",
          "altEn": "Two people discuss what happened and discover that they had understood it differently.",
          "altJa": "誤解だったと説明。出来事の意外な結末を説明する場面。",
          "sceneEn": "Explaining an eventual misunderstanding",
          "sceneJa": "誤解だったと説明"
        }
      },
      "icon": "",
      "tags": [
        "storytelling",
        "outcome",
        "phrasal-verb"
      ]
    }
  },
  {
    "id": "phrase-l23-03",
    "category": "phrases",
    "level": 23,
    "before_fields": {
      "title_en": "I couldn't stop laughing.",
      "title_ja": "笑いが止まりませんでした。",
      "content": {
        "phrase": "I couldn't stop laughing.",
        "japanese": "笑いが止まりませんでした。",
        "situation": "とてもおもしろかった出来事を振り返るとき",
        "naturalUsage": "stop + 動名詞で、その動作をやめるという意味になります。",
        "exampleDialogue": "A: How was the comedy show? B: I couldn't stop laughing.",
        "commonMistake": "stop to laugh は別の行動を止めて笑う意味なので、stop laughing を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "storytelling",
        "emotion",
        "reaction"
      ]
    },
    "after_fields": {
      "title_en": "I couldn't stop laughing.",
      "title_ja": "笑いが止まりませんでした。",
      "content": {
        "phrase": "I couldn't stop laughing.",
        "japanese": "笑いが止まりませんでした。",
        "situation": "とてもおもしろかった出来事を振り返るとき",
        "naturalUsage": "stop + 動名詞で、その動作をやめるという意味になります。",
        "exampleDialogue": "A: How was the comedy show? B: I couldn't stop laughing.",
        "commonMistake": "stop to laugh は別の行動を止めて笑う意味なので、stop laughing を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-849b7f6bf72266bd.svg",
          "kind": "scene",
          "altEn": "A viewer recalls a funny television scene and cannot stop laughing.",
          "altJa": "おもしろかった出来事。とてもおもしろかった出来事を振り返る場面。",
          "sceneEn": "Remembering a funny moment",
          "sceneJa": "おもしろかった出来事"
        }
      },
      "icon": "",
      "tags": [
        "storytelling",
        "emotion",
        "reaction"
      ]
    }
  },
  {
    "id": "phrase-l23-04",
    "category": "phrases",
    "level": 23,
    "before_fields": {
      "title_en": "That must have been stressful.",
      "title_ja": "それは大変だったでしょうね。",
      "content": {
        "phrase": "That must have been stressful.",
        "japanese": "それは大変だったでしょうね。",
        "situation": "相手のつらい体験に共感するとき",
        "naturalUsage": "過去の状況を想像し、must have been で強い共感を示します。",
        "exampleDialogue": "A: My flight was canceled at midnight. B: That must have been stressful.",
        "commonMistake": "That must be stressful. は現在の状況、過去の体験には must have been を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "empathy",
        "storytelling",
        "past-deduction"
      ]
    },
    "after_fields": {
      "title_en": "That must have been stressful.",
      "title_ja": "それは大変だったでしょうね。",
      "content": {
        "phrase": "That must have been stressful.",
        "japanese": "それは大変だったでしょうね。",
        "situation": "相手のつらい体験に共感するとき",
        "naturalUsage": "過去の状況を想像し、must have been で強い共感を示します。",
        "exampleDialogue": "A: My flight was canceled at midnight. B: That must have been stressful.",
        "commonMistake": "That must be stressful. は現在の状況、過去の体験には must have been を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-7e9b162b3f7d89b1.svg",
          "kind": "scene",
          "altEn": "A listener offers care as a worried friend describes a difficult day.",
          "altJa": "大変な体験に共感。相手のつらい体験に共感する場面。",
          "sceneEn": "Responding with empathy",
          "sceneJa": "大変な体験に共感"
        }
      },
      "icon": "",
      "tags": [
        "empathy",
        "storytelling",
        "past-deduction"
      ]
    }
  },
  {
    "id": "phrase-l24-01",
    "category": "phrases",
    "level": 24,
    "before_fields": {
      "title_en": "I'm working on being more consistent.",
      "title_ja": "もっと継続できるよう取り組んでいます。",
      "content": {
        "phrase": "I'm working on being more consistent.",
        "japanese": "もっと継続できるよう取り組んでいます。",
        "situation": "改善したい習慣や目標を話すとき",
        "naturalUsage": "work on + 動名詞で、時間をかけて改善中だと伝えます。",
        "exampleDialogue": "A: How is your English practice going? B: I'm working on being more consistent.",
        "commonMistake": "work to being ではなく、work on being とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "goals",
        "habits",
        "self-improvement"
      ]
    },
    "after_fields": {
      "title_en": "I'm working on being more consistent.",
      "title_ja": "もっと継続できるよう取り組んでいます。",
      "content": {
        "phrase": "I'm working on being more consistent.",
        "japanese": "もっと継続できるよう取り組んでいます。",
        "situation": "改善したい習慣や目標を話すとき",
        "naturalUsage": "work on + 動名詞で、時間をかけて改善中だと伝えます。",
        "exampleDialogue": "A: How is your English practice going? B: I'm working on being more consistent.",
        "commonMistake": "work to being ではなく、work on being とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-3ae698f8f9aa57e7.svg",
          "kind": "sequence",
          "altEn": "A learner uses a calendar to maintain a little workbook practice every day.",
          "altJa": "毎日続ける学習習慣。改善したい習慣や目標を話す場面。",
          "sceneEn": "Building a steady learning habit",
          "sceneJa": "毎日続ける学習習慣"
        }
      },
      "icon": "",
      "tags": [
        "goals",
        "habits",
        "self-improvement"
      ]
    }
  },
  {
    "id": "phrase-l24-02",
    "category": "phrases",
    "level": 24,
    "before_fields": {
      "title_en": "I've made more progress than I realized.",
      "title_ja": "思っていた以上に上達していました。",
      "content": {
        "phrase": "I've made more progress than I realized.",
        "japanese": "思っていた以上に上達していました。",
        "situation": "自分の成長に気づいたとき",
        "naturalUsage": "これまでの積み重ねによる現在の進歩を現在完了で表します。",
        "exampleDialogue": "A: Listen to your recording from last year. B: I've made more progress than I realized.",
        "commonMistake": "make a progress とは言わず、不可算名詞として make progress と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "progress",
        "reflection",
        "present-perfect"
      ]
    },
    "after_fields": {
      "title_en": "I've made more progress than I realized.",
      "title_ja": "思っていた以上に上達していました。",
      "content": {
        "phrase": "I've made more progress than I realized.",
        "japanese": "思っていた以上に上達していました。",
        "situation": "自分の成長に気づいたとき",
        "naturalUsage": "これまでの積み重ねによる現在の進歩を現在完了で表します。",
        "exampleDialogue": "A: Listen to your recording from last year. B: I've made more progress than I realized.",
        "commonMistake": "make a progress とは言わず、不可算名詞として make progress と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-6536fc55b1a00ff2.svg",
          "kind": "contrast",
          "altEn": "A learner compares an early worksheet with a recent achievement and notices their growth.",
          "altJa": "自分の成長に気づく。自分の成長に気づいた場面。",
          "sceneEn": "Noticing personal progress",
          "sceneJa": "自分の成長に気づく"
        }
      },
      "icon": "",
      "tags": [
        "progress",
        "reflection",
        "present-perfect"
      ]
    }
  },
  {
    "id": "phrase-l24-03",
    "category": "phrases",
    "level": 24,
    "before_fields": {
      "title_en": "I'm taking it one step at a time.",
      "title_ja": "一歩ずつ進めています。",
      "content": {
        "phrase": "I'm taking it one step at a time.",
        "japanese": "一歩ずつ進めています。",
        "situation": "大きな目標へ焦らず着実に進むとき",
        "naturalUsage": "難しい課題に無理なく取り組む姿勢を表す決まり表現です。",
        "exampleDialogue": "A: Isn't the course difficult? B: It is, but I'm taking it one step at a time.",
        "commonMistake": "step by step も使えますが、この文では one step at a time が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "goals",
        "progress",
        "mindset"
      ]
    },
    "after_fields": {
      "title_en": "I'm taking it one step at a time.",
      "title_ja": "一歩ずつ進めています。",
      "content": {
        "phrase": "I'm taking it one step at a time.",
        "japanese": "一歩ずつ進めています。",
        "situation": "大きな目標へ焦らず着実に進むとき",
        "naturalUsage": "難しい課題に無理なく取り組む姿勢を表す決まり表現です。",
        "exampleDialogue": "A: Isn't the course difficult? B: It is, but I'm taking it one step at a time.",
        "commonMistake": "one step at a time は一度に一歩ずつ進める意味です。take it step by step も自然な表現です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-debf3591676b737d.svg",
          "kind": "sequence",
          "altEn": "A learner takes a series of small steps towards a certificate marking their learning goal.",
          "altJa": "大きな目標へ一歩ずつ。大きな目標へ焦らず着実に進む場面。",
          "sceneEn": "Approaching a large goal gradually",
          "sceneJa": "大きな目標へ一歩ずつ"
        }
      },
      "icon": "",
      "tags": [
        "goals",
        "progress",
        "mindset"
      ]
    }
  },
  {
    "id": "phrase-l24-04",
    "category": "phrases",
    "level": 24,
    "before_fields": {
      "title_en": "What would you like to improve next?",
      "title_ja": "次は何を伸ばしたいですか？",
      "content": {
        "phrase": "What would you like to improve next?",
        "japanese": "次は何を伸ばしたいですか？",
        "situation": "次の学習目標を一緒に考えるとき",
        "naturalUsage": "would like to で、相手の希望を丁寧に尋ねます。",
        "exampleDialogue": "A: Your pronunciation is much clearer. What would you like to improve next? B: My listening skills.",
        "commonMistake": "What do you want improve? ではなく、want to improve または would like to improve とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "goals",
        "learning",
        "question"
      ]
    },
    "after_fields": {
      "title_en": "What would you like to improve next?",
      "title_ja": "次は何を伸ばしたいですか？",
      "content": {
        "phrase": "What would you like to improve next?",
        "japanese": "次は何を伸ばしたいですか？",
        "situation": "次の学習目標を一緒に考えるとき",
        "naturalUsage": "would like to で、相手の希望を丁寧に尋ねます。",
        "exampleDialogue": "A: Your pronunciation is much clearer. What would you like to improve next? B: My listening skills.",
        "commonMistake": "What do you want improve? ではなく、want to improve または would like to improve とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-4817ff48b92d1a27.svg",
          "kind": "scene",
          "altEn": "A teacher and learner compare reading and speaking as possible next goals.",
          "altJa": "次の学習目標を相談。次の学習目標を一緒に考える場面。",
          "sceneEn": "Choosing a next learning goal",
          "sceneJa": "次の学習目標を相談"
        }
      },
      "icon": "",
      "tags": [
        "goals",
        "learning",
        "question"
      ]
    }
  },
  {
    "id": "phrase-l25-01",
    "category": "phrases",
    "level": 25,
    "before_fields": {
      "title_en": "I understand your point, but I see it differently.",
      "title_ja": "おっしゃる点は分かりますが、私は違う見方をしています。",
      "content": {
        "phrase": "I understand your point, but I see it differently.",
        "japanese": "おっしゃる点は分かりますが、私は違う見方をしています。",
        "situation": "相手を尊重しながら異なる意見を述べるとき",
        "naturalUsage": "理解を示してから but で自分の見方を伝える、建設的な反対表現です。",
        "exampleDialogue": "A: Speed should be our top priority. B: I understand your point, but I see it differently.",
        "commonMistake": "I have a different opinion than you. より、この形は人ではなく見方の違いに焦点を当てます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "disagreement",
        "diplomacy",
        "discussion"
      ]
    },
    "after_fields": {
      "title_en": "I understand your point, but I see it differently.",
      "title_ja": "おっしゃる点は分かりますが、私は違う見方をしています。",
      "content": {
        "phrase": "I understand your point, but I see it differently.",
        "japanese": "おっしゃる点は分かりますが、私は違う見方をしています。",
        "situation": "相手を尊重しながら異なる意見を述べるとき",
        "naturalUsage": "理解を示してから but で自分の見方を伝える、建設的な反対表現です。",
        "exampleDialogue": "A: Speed should be our top priority. B: I understand your point, but I see it differently.",
        "commonMistake": "I have a different opinion than you. より、この形は人ではなく見方の違いに焦点を当てます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-56f1e082d8004819.svg",
          "kind": "contrast",
          "altEn": "One traveller listens respectfully to a suggestion to take the bus but prefers walking.",
          "altJa": "移動方法について違う意見。相手を尊重しながら異なる意見を述べる場面。",
          "sceneEn": "Different ways to travel",
          "sceneJa": "移動方法について違う意見"
        }
      },
      "icon": "",
      "tags": [
        "disagreement",
        "diplomacy",
        "discussion"
      ]
    }
  },
  {
    "id": "phrase-l25-02",
    "category": "phrases",
    "level": 25,
    "before_fields": {
      "title_en": "I'm not sure that's the whole picture.",
      "title_ja": "それだけが全体像ではないと思います。",
      "content": {
        "phrase": "I'm not sure that's the whole picture.",
        "japanese": "それだけが全体像ではないと思います。",
        "situation": "議論に不足している視点があると示すとき",
        "naturalUsage": "相手の主張を真っ向から否定せず、追加検討を促します。",
        "exampleDialogue": "A: The low score means the idea failed. B: I'm not sure that's the whole picture.",
        "commonMistake": "whole picture は文字どおりの写真ではなく、状況全体という比喩です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "disagreement",
        "perspective",
        "softening"
      ]
    },
    "after_fields": {
      "title_en": "I'm not sure that's the whole picture.",
      "title_ja": "それだけが全体像ではないと思います。",
      "content": {
        "phrase": "I'm not sure that's the whole picture.",
        "japanese": "それだけが全体像ではないと思います。",
        "situation": "議論に不足している視点があると示すとき",
        "naturalUsage": "相手の主張を真っ向から否定せず、追加検討を促します。",
        "exampleDialogue": "A: The low score means the idea failed. B: I'm not sure that's the whole picture.",
        "commonMistake": "whole picture は文字どおりの写真ではなく、状況全体という比喩です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-faf17a21074e0132.svg",
          "kind": "contrast",
          "altEn": "A single puzzle piece is contrasted with the full picture that includes more information.",
          "altJa": "一部だけで判断しない。議論に不足している視点があると示す場面。",
          "sceneEn": "Looking beyond one piece of evidence",
          "sceneJa": "一部だけで判断しない"
        }
      },
      "icon": "",
      "tags": [
        "disagreement",
        "perspective",
        "softening"
      ]
    }
  },
  {
    "id": "phrase-l25-03",
    "category": "phrases",
    "level": 25,
    "before_fields": {
      "title_en": "Could there be another explanation?",
      "title_ja": "別の説明も考えられませんか？",
      "content": {
        "phrase": "Could there be another explanation?",
        "japanese": "別の説明も考えられませんか？",
        "situation": "結論に対する別の可能性を提案するとき",
        "naturalUsage": "疑問形で代案を示すため、議論の雰囲気を協力的に保てます。",
        "exampleDialogue": "A: She didn't reply, so she must be upset. B: Could there be another explanation?",
        "commonMistake": "Is there can be ... とはせず、Could there be ... の語順にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "discussion",
        "alternative",
        "critical-thinking"
      ]
    },
    "after_fields": {
      "title_en": "Could there be another explanation?",
      "title_ja": "別の説明も考えられませんか？",
      "content": {
        "phrase": "Could there be another explanation?",
        "japanese": "別の説明も考えられませんか？",
        "situation": "結論に対する別の可能性を提案するとき",
        "naturalUsage": "疑問形で代案を示すため、議論の雰囲気を協力的に保てます。",
        "exampleDialogue": "A: She didn't reply, so she must be upset. B: Could there be another explanation?",
        "commonMistake": "Is there can be ... とはせず、Could there be ... の語順にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-0b01add2d704af19.svg",
          "kind": "contrast",
          "altEn": "A wilting plant prompts two possible explanations involving water and sunlight.",
          "altJa": "別の原因を考える。結論に対する別の可能性を提案する場面。",
          "sceneEn": "Suggesting another cause",
          "sceneJa": "別の原因を考える"
        }
      },
      "icon": "",
      "tags": [
        "discussion",
        "alternative",
        "critical-thinking"
      ]
    }
  },
  {
    "id": "phrase-l25-04",
    "category": "phrases",
    "level": 25,
    "before_fields": {
      "title_en": "Let's agree to disagree on that.",
      "title_ja": "その点は意見の違いを認め合いましょう。",
      "content": {
        "phrase": "Let's agree to disagree on that.",
        "japanese": "その点は意見の違いを認め合いましょう。",
        "situation": "意見の一致が難しく、友好的に議論を終えるとき",
        "naturalUsage": "互いの立場を変えずに、対立を長引かせないための表現です。",
        "exampleDialogue": "A: I still prefer the original design. B: Fair enough. Let's agree to disagree on that.",
        "commonMistake": "これは相手に同意する表現ではなく、意見の不一致を受け入れる表現です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "disagreement",
        "resolution",
        "diplomacy"
      ]
    },
    "after_fields": {
      "title_en": "Let's agree to disagree on that.",
      "title_ja": "その点は意見の違いを認め合いましょう。",
      "content": {
        "phrase": "Let's agree to disagree on that.",
        "japanese": "その点は意見の違いを認め合いましょう。",
        "situation": "意見の一致が難しく、友好的に議論を終えるとき",
        "naturalUsage": "好みなど、結論を一つにする必要がない話題で使います。共同の決定が必要な場面では、次の解決策も話し合いましょう。",
        "exampleDialogue": "A: I still prefer the original design. B: Fair enough. Let's agree to disagree on that.",
        "commonMistake": "これは相手に同意する表現ではなく、意見の不一致を受け入れる表現です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-233e3451032e42f3.svg",
          "kind": "scene",
          "altEn": "People with different views finish their discussion with a respectful handshake.",
          "altJa": "意見の違いを認め合う。意見の一致が難しく、友好的に議論を終える場面。",
          "sceneEn": "Ending a disagreement amicably",
          "sceneJa": "意見の違いを認め合う"
        }
      },
      "icon": "",
      "tags": [
        "disagreement",
        "resolution",
        "diplomacy"
      ]
    }
  },
  {
    "id": "phrase-l26-01",
    "category": "phrases",
    "level": 26,
    "before_fields": {
      "title_en": "Let me walk you through the main idea.",
      "title_ja": "中心となる考えを順にご説明します。",
      "content": {
        "phrase": "Let me walk you through the main idea.",
        "japanese": "中心となる考えを順にご説明します。",
        "situation": "発表や説明を始めるとき",
        "naturalUsage": "walk someone through ... は、手順や内容を順を追って案内する表現です。",
        "exampleDialogue": "A: This diagram looks complicated. B: Let me walk you through the main idea.",
        "commonMistake": "walk through you ではなく、walk you through ... の順にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "presentation",
        "explanation",
        "professional"
      ]
    },
    "after_fields": {
      "title_en": "Let me walk you through the main idea.",
      "title_ja": "中心となる考えを順にご説明します。",
      "content": {
        "phrase": "Let me walk you through the main idea.",
        "japanese": "中心となる考えを順にご説明します。",
        "situation": "発表や説明を始めるとき",
        "naturalUsage": "walk someone through ... は、手順や内容を順を追って案内する表現です。",
        "exampleDialogue": "A: This diagram looks complicated. B: Let me walk you through the main idea.",
        "commonMistake": "walk through you ではなく、walk you through ... の順にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-bcbd0cdc4c3f1d0c.svg",
          "kind": "sequence",
          "altEn": "A presenter uses ordered index cards to explain a main idea step by step.",
          "altJa": "中心の考えを順に説明。発表や説明を始める場面。",
          "sceneEn": "Explaining an idea in order",
          "sceneJa": "中心の考えを順に説明"
        }
      },
      "icon": "",
      "tags": [
        "presentation",
        "explanation",
        "professional"
      ]
    }
  },
  {
    "id": "phrase-l26-02",
    "category": "phrases",
    "level": 26,
    "before_fields": {
      "title_en": "The key takeaway is that small changes add up.",
      "title_ja": "重要なポイントは、小さな変化も積み重なるということです。",
      "content": {
        "phrase": "The key takeaway is that small changes add up.",
        "japanese": "重要なポイントは、小さな変化も積み重なるということです。",
        "situation": "発表の要点をまとめるとき",
        "naturalUsage": "key takeaway は聞き手に覚えてほしい最重要点を示します。",
        "exampleDialogue": "A: How would you summarize the results? B: The key takeaway is that small changes add up.",
        "commonMistake": "takeaway はここでは持ち帰り料理ではなく、学ぶべき要点という意味です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "presentation",
        "summary",
        "key-point"
      ]
    },
    "after_fields": {
      "title_en": "The key takeaway is that small changes add up.",
      "title_ja": "重要なポイントは、小さな変化も積み重なるということです。",
      "content": {
        "phrase": "The key takeaway is that small changes add up.",
        "japanese": "重要なポイントは、小さな変化も積み重なるということです。",
        "situation": "発表の要点をまとめるとき",
        "naturalUsage": "key takeaway は聞き手に覚えてほしい最重要点を示します。",
        "exampleDialogue": "A: How would you summarize the results? B: The key takeaway is that small changes add up.",
        "commonMistake": "takeaway はここでは持ち帰り料理ではなく、学ぶべき要点という意味です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-b1c4d9c9c22e7dfb.svg",
          "kind": "sequence",
          "altEn": "Small pieces added one at a time produce a complete result.",
          "altJa": "小さな変化の積み重ね。発表の要点をまとめる場面。",
          "sceneEn": "Summarising cumulative change",
          "sceneJa": "小さな変化の積み重ね"
        }
      },
      "icon": "",
      "tags": [
        "presentation",
        "summary",
        "key-point"
      ]
    }
  },
  {
    "id": "phrase-l26-03",
    "category": "phrases",
    "level": 26,
    "before_fields": {
      "title_en": "I'd like to build on that idea.",
      "title_ja": "その考えをさらに発展させたいと思います。",
      "content": {
        "phrase": "I'd like to build on that idea.",
        "japanese": "その考えをさらに発展させたいと思います。",
        "situation": "他の人の発言につなげて意見を加えるとき",
        "naturalUsage": "相手の貢献を認めながら、自分の考えへ滑らかにつなげます。",
        "exampleDialogue": "A: We should ask users earlier. B: I'd like to build on that idea.",
        "commonMistake": "build up that idea より、考えを発展させる場合は build on that idea です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "discussion",
        "collaboration",
        "idea"
      ]
    },
    "after_fields": {
      "title_en": "I'd like to build on that idea.",
      "title_ja": "その考えをさらに発展させたいと思います。",
      "content": {
        "phrase": "I'd like to build on that idea.",
        "japanese": "その考えをさらに発展させたいと思います。",
        "situation": "他の人の発言につなげて意見を加えるとき",
        "naturalUsage": "相手の貢献を認めながら、自分の考えへ滑らかにつなげます。",
        "exampleDialogue": "A: We should ask users earlier. B: I'd like to build on that idea.",
        "commonMistake": "build up that idea より、考えを発展させる場合は build on that idea です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-9aa4799679307d44.svg",
          "kind": "sequence",
          "altEn": "An existing idea is expanded by adding another contribution and building further.",
          "altJa": "相手の案を発展。他の人の発言につなげて意見を加える場面。",
          "sceneEn": "Developing someone else's idea",
          "sceneJa": "相手の案を発展"
        }
      },
      "icon": "",
      "tags": [
        "discussion",
        "collaboration",
        "idea"
      ]
    }
  },
  {
    "id": "phrase-l26-04",
    "category": "phrases",
    "level": 26,
    "before_fields": {
      "title_en": "Does anyone have a different perspective?",
      "title_ja": "別の視点をお持ちの方はいますか？",
      "content": {
        "phrase": "Does anyone have a different perspective?",
        "japanese": "別の視点をお持ちの方はいますか？",
        "situation": "議論で多様な意見を募るとき",
        "naturalUsage": "反対意見も歓迎していることを示す、開かれた問いかけです。",
        "exampleDialogue": "A: We've heard two similar suggestions. Does anyone have a different perspective? B: I do.",
        "commonMistake": "another perspective は追加の一つ、different perspective は異なる視点を強調します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "discussion",
        "facilitation",
        "perspective"
      ]
    },
    "after_fields": {
      "title_en": "Does anyone have a different perspective?",
      "title_ja": "別の視点をお持ちの方はいますか？",
      "content": {
        "phrase": "Does anyone have a different perspective?",
        "japanese": "別の視点をお持ちの方はいますか？",
        "situation": "議論で多様な意見を募るとき",
        "naturalUsage": "反対意見も歓迎していることを示す、開かれた問いかけです。",
        "exampleDialogue": "A: We've heard two similar suggestions. Does anyone have a different perspective? B: I do.",
        "commonMistake": "another perspective は追加の一つ、different perspective は異なる視点を強調します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-4ba6dc0669d0d3aa.svg",
          "kind": "scene",
          "altEn": "A group discussion invites someone to share a different way of looking at the issue.",
          "altJa": "別の視点を募る。議論で多様な意見を募る場面。",
          "sceneEn": "Inviting different perspectives",
          "sceneJa": "別の視点を募る"
        }
      },
      "icon": "",
      "tags": [
        "discussion",
        "facilitation",
        "perspective"
      ]
    }
  },
  {
    "id": "phrase-l27-01",
    "category": "phrases",
    "level": 27,
    "before_fields": {
      "title_en": "What would a fair compromise look like?",
      "title_ja": "公平な妥協案とはどのようなものでしょうか？",
      "content": {
        "phrase": "What would a fair compromise look like?",
        "japanese": "公平な妥協案とはどのようなものでしょうか？",
        "situation": "双方が受け入れられる解決策を探すとき",
        "naturalUsage": "特定案を押しつけず、共同で着地点を考える質問です。",
        "exampleDialogue": "A: Neither side likes the current proposal. B: What would a fair compromise look like?",
        "commonMistake": "compromise は常に悪い妥協ではなく、双方が譲る合意も表します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "negotiation",
        "compromise",
        "question"
      ]
    },
    "after_fields": {
      "title_en": "What would a fair compromise look like?",
      "title_ja": "公平な妥協案とはどのようなものでしょうか？",
      "content": {
        "phrase": "What would a fair compromise look like?",
        "japanese": "公平な妥協案とはどのようなものでしょうか？",
        "situation": "双方が受け入れられる解決策を探すとき",
        "naturalUsage": "特定案を押しつけず、共同で着地点を考える質問です。",
        "exampleDialogue": "A: Neither side likes the current proposal. B: What would a fair compromise look like?",
        "commonMistake": "compromise は常に悪い妥協ではなく、双方が譲る合意も表します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-5dc6357a4ba2edfc.svg",
          "kind": "contrast",
          "altEn": "Two people consider their needs and agree to a fair division.",
          "altJa": "公平な折り合いを探す。双方が受け入れられる解決策を探す場面。",
          "sceneEn": "Finding a fair middle ground",
          "sceneJa": "公平な折り合いを探す"
        }
      },
      "icon": "",
      "tags": [
        "negotiation",
        "compromise",
        "question"
      ]
    }
  },
  {
    "id": "phrase-l27-02",
    "category": "phrases",
    "level": 27,
    "before_fields": {
      "title_en": "I can be flexible on the timing.",
      "title_ja": "時期については柔軟に対応できます。",
      "content": {
        "phrase": "I can be flexible on the timing.",
        "japanese": "時期については柔軟に対応できます。",
        "situation": "交渉で譲れる条件を示すとき",
        "naturalUsage": "on のあとに、柔軟に変更できる具体的な点を置きます。",
        "exampleDialogue": "A: The budget is fixed, but the date isn't. B: I can be flexible on the timing.",
        "commonMistake": "flexible for the timing より、条件については flexible on が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "negotiation",
        "flexibility",
        "scheduling"
      ]
    },
    "after_fields": {
      "title_en": "I can be flexible on the timing.",
      "title_ja": "時期については柔軟に対応できます。",
      "content": {
        "phrase": "I can be flexible on the timing.",
        "japanese": "時期については柔軟に対応できます。",
        "situation": "交渉で譲れる条件を示すとき",
        "naturalUsage": "on のあとに、柔軟に変更できる具体的な点を置きます。",
        "exampleDialogue": "A: The budget is fixed, but the date isn't. B: I can be flexible on the timing.",
        "commonMistake": "flexible for the timing より、条件については flexible on が自然です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-2be4bf2185f712b6.svg",
          "kind": "scene",
          "altEn": "A colleague is willing to move calendar dates or times to make an arrangement work.",
          "altJa": "日程を柔軟に調整。交渉で譲れる条件を示す場面。",
          "sceneEn": "Being flexible about timing",
          "sceneJa": "日程を柔軟に調整"
        }
      },
      "icon": "",
      "tags": [
        "negotiation",
        "flexibility",
        "scheduling"
      ]
    }
  },
  {
    "id": "phrase-l27-03",
    "category": "phrases",
    "level": 27,
    "before_fields": {
      "title_en": "That works for me, provided we keep the scope small.",
      "title_ja": "範囲を小さく保つのであれば、私はそれで大丈夫です。",
      "content": {
        "phrase": "That works for me, provided we keep the scope small.",
        "japanese": "範囲を小さく保つのであれば、私はそれで大丈夫です。",
        "situation": "条件付きで提案に同意するとき",
        "naturalUsage": "provided ... で、合意に必要な条件を明確に示します。",
        "exampleDialogue": "A: Can we test the idea this month? B: That works for me, provided we keep the scope small.",
        "commonMistake": "provided はここでは「提供された」ではなく、if と同じ条件の意味です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "negotiation",
        "condition",
        "agreement"
      ]
    },
    "after_fields": {
      "title_en": "That works for me, provided we keep the scope small.",
      "title_ja": "範囲を小さく保つのであれば、私はそれで大丈夫です。",
      "content": {
        "phrase": "That works for me, provided we keep the scope small.",
        "japanese": "範囲を小さく保つのであれば、私はそれで大丈夫です。",
        "situation": "条件付きで提案に同意するとき",
        "naturalUsage": "provided (that) ... は条件付きの合意を示す、少し改まった表現です。日常会話なら as long as ... も自然です。",
        "exampleDialogue": "A: Can we test the idea this month? B: That works for me, provided we keep the scope small.",
        "commonMistake": "provided はここでは「提供された」ではなく、if と同じ条件の意味です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-9ca8ed4ccef5c72e.svg",
          "kind": "contrast",
          "altEn": "A proposal is accepted on the condition that the work covers one worksheet rather than the whole book.",
          "altJa": "取り組む範囲を決める。条件付きで提案に同意する場面。",
          "sceneEn": "Agreeing on a manageable task",
          "sceneJa": "取り組む範囲を決める"
        }
      },
      "icon": "",
      "tags": [
        "negotiation",
        "condition",
        "agreement"
      ]
    }
  },
  {
    "id": "phrase-l27-04",
    "category": "phrases",
    "level": 27,
    "before_fields": {
      "title_en": "I think we're closer to an agreement.",
      "title_ja": "合意に近づいていると思います。",
      "content": {
        "phrase": "I think we're closer to an agreement.",
        "japanese": "合意に近づいていると思います。",
        "situation": "交渉が前進したことを確認するとき",
        "naturalUsage": "まだ合意済みとは言わず、進展を前向きに評価します。",
        "exampleDialogue": "A: We both support the revised schedule. B: I think we're closer to an agreement.",
        "commonMistake": "close to agree ではなく、close to an agreement と名詞を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "negotiation",
        "progress",
        "agreement"
      ]
    },
    "after_fields": {
      "title_en": "I think we're closer to an agreement.",
      "title_ja": "合意に近づいていると思います。",
      "content": {
        "phrase": "I think we're closer to an agreement.",
        "japanese": "合意に近づいていると思います。",
        "situation": "交渉が前進したことを確認するとき",
        "naturalUsage": "まだ合意済みとは言わず、進展を前向きに評価します。",
        "exampleDialogue": "A: We both support the revised schedule. B: I think we're closer to an agreement.",
        "commonMistake": "close to agree ではなく、close to an agreement と名詞を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-2882038088bde280.svg",
          "kind": "sequence",
          "altEn": "Colleagues discuss possible calendar dates and move closer to an agreement they can shake hands on.",
          "altJa": "日程の合意に近づく。交渉が前進したことを確認する場面。",
          "sceneEn": "Reaching a scheduling agreement",
          "sceneJa": "日程の合意に近づく"
        }
      },
      "icon": "",
      "tags": [
        "negotiation",
        "progress",
        "agreement"
      ]
    }
  },
  {
    "id": "phrase-l28-01",
    "category": "phrases",
    "level": 28,
    "before_fields": {
      "title_en": "I'm still getting the hang of it.",
      "title_ja": "まだコツをつかんでいる途中です。",
      "content": {
        "phrase": "I'm still getting the hang of it.",
        "japanese": "まだコツをつかんでいる途中です。",
        "situation": "新しい技能にまだ慣れていないとき",
        "naturalUsage": "できないと否定せず、上達中であることを前向きに伝えます。",
        "exampleDialogue": "A: How are you finding the new software? B: I'm still getting the hang of it.",
        "commonMistake": "get the hang of it は「ぶら下がる」ではなく「コツをつかむ」という慣用表現です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "idiom",
        "learning",
        "progress"
      ]
    },
    "after_fields": {
      "title_en": "I'm still getting the hang of it.",
      "title_ja": "まだコツをつかんでいる途中です。",
      "content": {
        "phrase": "I'm still getting the hang of it.",
        "japanese": "まだコツをつかんでいる途中です。",
        "situation": "新しい技能にまだ慣れていないとき",
        "naturalUsage": "できないと否定せず、上達中であることを前向きに伝えます。",
        "exampleDialogue": "A: How are you finding the new software? B: I'm still getting the hang of it.",
        "commonMistake": "get the hang of it は「ぶら下がる」ではなく「コツをつかむ」という慣用表現です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-83dda2f0ec4f9151.svg",
          "kind": "sequence",
          "altEn": "A beginner practises brush control and gradually becomes more comfortable with painting.",
          "altJa": "新しい技能のコツを練習。新しい技能にまだ慣れていない場面。",
          "sceneEn": "Learning the feel of a new skill",
          "sceneJa": "新しい技能のコツを練習"
        }
      },
      "icon": "",
      "tags": [
        "idiom",
        "learning",
        "progress"
      ]
    }
  },
  {
    "id": "phrase-l28-02",
    "category": "phrases",
    "level": 28,
    "before_fields": {
      "title_en": "Let's call it a day.",
      "title_ja": "今日はここまでにしましょう。",
      "content": {
        "phrase": "Let's call it a day.",
        "japanese": "今日はここまでにしましょう。",
        "situation": "その日の作業を終えるとき",
        "naturalUsage": "十分作業したあと、区切りを提案する定番の慣用表現です。",
        "exampleDialogue": "A: We've finished all the urgent tasks. B: Great. Let's call it a day.",
        "commonMistake": "実際に何かを day と呼ぶ意味ではありません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "idiom",
        "work",
        "ending"
      ]
    },
    "after_fields": {
      "title_en": "Let's call it a day.",
      "title_ja": "今日はここまでにしましょう。",
      "content": {
        "phrase": "Let's call it a day.",
        "japanese": "今日はここまでにしましょう。",
        "situation": "その日の作業を終えるとき",
        "naturalUsage": "十分作業したあと、区切りを提案する定番の慣用表現です。",
        "exampleDialogue": "A: We've finished all the urgent tasks. B: Great. Let's call it a day.",
        "commonMistake": "実際に何かを day と呼ぶ意味ではありません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-0dd54ffa55267a60.svg",
          "kind": "sequence",
          "altEn": "Colleagues finish the day's work and leave the office.",
          "altJa": "その日の仕事を終える。その日の作業を終える場面。",
          "sceneEn": "Finishing the day's work",
          "sceneJa": "その日の仕事を終える"
        }
      },
      "icon": "",
      "tags": [
        "idiom",
        "work",
        "ending"
      ]
    }
  },
  {
    "id": "phrase-l28-03",
    "category": "phrases",
    "level": 28,
    "before_fields": {
      "title_en": "That idea is worth keeping in mind.",
      "title_ja": "その考えは覚えておく価値があります。",
      "content": {
        "phrase": "That idea is worth keeping in mind.",
        "japanese": "その考えは覚えておく価値があります。",
        "situation": "今すぐ採用しなくても後で役立つ意見を評価するとき",
        "naturalUsage": "keep in mind は忘れず考慮しておくという意味です。",
        "exampleDialogue": "A: We could invite former students next year. B: That idea is worth keeping in mind.",
        "commonMistake": "remember in mind のように同じ意味を重ねず、keep in mind とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "idiom",
        "idea",
        "consideration"
      ]
    },
    "after_fields": {
      "title_en": "That idea is worth keeping in mind.",
      "title_ja": "その考えは覚えておく価値があります。",
      "content": {
        "phrase": "That idea is worth keeping in mind.",
        "japanese": "その考えは覚えておく価値があります。",
        "situation": "今すぐ採用しなくても後で役立つ意見を評価するとき",
        "naturalUsage": "keep in mind は忘れず考慮しておくという意味です。",
        "exampleDialogue": "A: We could invite former students next year. B: That idea is worth keeping in mind.",
        "commonMistake": "remember in mind のように同じ意味を重ねず、keep in mind とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-df3dc3759e1ab440.svg",
          "kind": "sequence",
          "altEn": "Someone writes a useful idea in a notepad to remember it for later.",
          "altJa": "後で使える案を記録。今すぐ採用しなくても後で役立つ意見を評価する場面。",
          "sceneEn": "Saving an idea for later",
          "sceneJa": "後で使える案を記録"
        }
      },
      "icon": "",
      "tags": [
        "idiom",
        "idea",
        "consideration"
      ]
    }
  },
  {
    "id": "phrase-l28-04",
    "category": "phrases",
    "level": 28,
    "before_fields": {
      "title_en": "We're on the same page now.",
      "title_ja": "これで認識が一致しました。",
      "content": {
        "phrase": "We're on the same page now.",
        "japanese": "これで認識が一致しました。",
        "situation": "お互いの理解や方針が一致したとき",
        "naturalUsage": "話し合いのあとに共通理解を確認する慣用表現です。",
        "exampleDialogue": "A: So the first draft is due Tuesday. B: Right, we're on the same page now.",
        "commonMistake": "実際に同じページを開いている意味だけではなく、認識の一致にも使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "idiom",
        "agreement",
        "teamwork"
      ]
    },
    "after_fields": {
      "title_en": "We're on the same page now.",
      "title_ja": "これで認識が一致しました。",
      "content": {
        "phrase": "We're on the same page now.",
        "japanese": "これで認識が一致しました。",
        "situation": "お互いの理解や方針が一致したとき",
        "naturalUsage": "話し合いのあとに共通理解を確認する慣用表現です。",
        "exampleDialogue": "A: So the first draft is due Tuesday. B: Right, we're on the same page now.",
        "commonMistake": "意味は「共通の理解がある」です。We are in the same page. ではなく on the same page と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-29df9969a3f47667.svg",
          "kind": "scene",
          "altEn": "Colleagues discuss the same plan and confirm a shared understanding.",
          "altJa": "認識が一致する。お互いの理解や方針が一致した場面。",
          "sceneEn": "Reaching a shared understanding",
          "sceneJa": "認識が一致する"
        }
      },
      "icon": "",
      "tags": [
        "idiom",
        "agreement",
        "teamwork"
      ]
    }
  },
  {
    "id": "phrase-l29-01",
    "category": "phrases",
    "level": 29,
    "before_fields": {
      "title_en": "Just to keep you in the loop, the deadline has changed.",
      "title_ja": "情報共有ですが、締切が変更になりました。",
      "content": {
        "phrase": "Just to keep you in the loop, the deadline has changed.",
        "japanese": "情報共有ですが、締切が変更になりました。",
        "situation": "関係者へ最新情報を簡潔に伝えるとき",
        "naturalUsage": "keep someone in the loop は、進展を継続的に共有するという意味です。",
        "exampleDialogue": "A: Just to keep you in the loop, the deadline has changed. B: Thanks for letting me know.",
        "commonMistake": "in a loop ではなく、定型表現は in the loop です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "professional",
        "update",
        "idiom"
      ]
    },
    "after_fields": {
      "title_en": "Just to keep you in the loop, the deadline has changed.",
      "title_ja": "情報共有ですが、締切が変更になりました。",
      "content": {
        "phrase": "Just to keep you in the loop, the deadline has changed.",
        "japanese": "情報共有ですが、締切が変更になりました。",
        "situation": "関係者へ最新情報を簡潔に伝えるとき",
        "naturalUsage": "keep someone in the loop は、進展を継続的に共有するという意味です。",
        "exampleDialogue": "A: Just to keep you in the loop, the deadline has changed. B: Thanks for letting me know.",
        "commonMistake": "in a loop ではなく、定型表現は in the loop です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-a92fa960dc761b94.svg",
          "kind": "sequence",
          "altEn": "A changed deadline on the calendar is shared in a message to the team.",
          "altJa": "締切変更を共有。関係者へ最新情報を簡潔に伝える場面。",
          "sceneEn": "Sharing a deadline change",
          "sceneJa": "締切変更を共有"
        }
      },
      "icon": "",
      "tags": [
        "professional",
        "update",
        "idiom"
      ]
    }
  },
  {
    "id": "phrase-l29-02",
    "category": "phrases",
    "level": 29,
    "before_fields": {
      "title_en": "Could you clarify what you need from me?",
      "title_ja": "私に何をしてほしいのか明確にしていただけますか？",
      "content": {
        "phrase": "Could you clarify what you need from me?",
        "japanese": "私に何をしてほしいのか明確にしていただけますか？",
        "situation": "自分の役割や依頼内容が曖昧なとき",
        "naturalUsage": "相手を責めずに、必要な行動を具体化してもらう質問です。",
        "exampleDialogue": "A: We need your support on the launch. B: Could you clarify what you need from me?",
        "commonMistake": "clarify me とは言わず、clarify what ... または clarify something for me とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "professional",
        "clarification",
        "responsibility"
      ]
    },
    "after_fields": {
      "title_en": "Could you clarify what you need from me?",
      "title_ja": "私に何をしてほしいのか明確にしていただけますか？",
      "content": {
        "phrase": "Could you clarify what you need from me?",
        "japanese": "私に何をしてほしいのか明確にしていただけますか？",
        "situation": "自分の役割や依頼内容が曖昧なとき",
        "naturalUsage": "相手を責めずに、必要な行動を具体化してもらう質問です。",
        "exampleDialogue": "A: We need your support on the launch. B: Could you clarify what you need from me?",
        "commonMistake": "clarify me とは言わず、clarify what ... または clarify something for me とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-8a030e6f93d63c14.svg",
          "kind": "scene",
          "altEn": "A team member asks which part of a worksheet task they are responsible for.",
          "altJa": "依頼された役割を確認。自分の役割や依頼内容が曖昧な場面。",
          "sceneEn": "Clarifying a personal responsibility",
          "sceneJa": "依頼された役割を確認"
        }
      },
      "icon": "",
      "tags": [
        "professional",
        "clarification",
        "responsibility"
      ]
    }
  },
  {
    "id": "phrase-l29-03",
    "category": "phrases",
    "level": 29,
    "before_fields": {
      "title_en": "I'll make sure this is handled today.",
      "title_ja": "今日中に確実に対応します。",
      "content": {
        "phrase": "I'll make sure this is handled today.",
        "japanese": "今日中に確実に対応します。",
        "situation": "問題への対応を引き受けるとき",
        "naturalUsage": "自分が直接処理する場合にも、担当者へ確実につなぐ場合にも使えます。",
        "exampleDialogue": "A: The customer is still waiting for a reply. B: I'll make sure this is handled today.",
        "commonMistake": "handle は他動詞なので handle with this ではなく handle this とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "professional",
        "ownership",
        "deadline"
      ]
    },
    "after_fields": {
      "title_en": "I'll make sure this is handled today.",
      "title_ja": "今日中に確実に対応します。",
      "content": {
        "phrase": "I'll make sure this is handled today.",
        "japanese": "今日中に確実に対応します。",
        "situation": "問題への対応を引き受けるとき",
        "naturalUsage": "自分が直接処理する場合にも、担当者へ確実につなぐ場合にも使えます。",
        "exampleDialogue": "A: The customer is still waiting for a reply. B: I'll make sure this is handled today.",
        "commonMistake": "handle は他動詞なので handle with this ではなく handle this とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-52918f75782fa5ed.svg",
          "kind": "sequence",
          "altEn": "A colleague takes ownership of a document task and commits to finishing it today.",
          "altJa": "今日中の対応を引き受ける。問題への対応を引き受ける場面。",
          "sceneEn": "Taking responsibility for today's task",
          "sceneJa": "今日中の対応を引き受ける"
        }
      },
      "icon": "",
      "tags": [
        "professional",
        "ownership",
        "deadline"
      ]
    }
  },
  {
    "id": "phrase-l29-04",
    "category": "phrases",
    "level": 29,
    "before_fields": {
      "title_en": "I appreciate you bringing this to my attention.",
      "title_ja": "この件を知らせてくださりありがとうございます。",
      "content": {
        "phrase": "I appreciate you bringing this to my attention.",
        "japanese": "この件を知らせてくださりありがとうございます。",
        "situation": "問題や見落としを知らせてもらったとき",
        "naturalUsage": "指摘に防御的にならず、共有への感謝を丁寧に示します。",
        "exampleDialogue": "A: One figure in the report may be outdated. B: I appreciate you bringing this to my attention.",
        "commonMistake": "appreciate の直後は to bring ではなく、you bringing の形にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "professional",
        "thanks",
        "feedback"
      ]
    },
    "after_fields": {
      "title_en": "I appreciate you bringing this to my attention.",
      "title_ja": "この件を知らせてくださりありがとうございます。",
      "content": {
        "phrase": "I appreciate you bringing this to my attention.",
        "japanese": "この件を知らせてくださりありがとうございます。",
        "situation": "問題や見落としを知らせてもらったとき",
        "naturalUsage": "指摘に防御的にならず、共有への感謝を丁寧に示します。",
        "exampleDialogue": "A: One figure in the report may be outdated. B: I appreciate you bringing this to my attention.",
        "commonMistake": "appreciate の直後は to bring ではなく、you bringing の形にします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-0fce85cb6dad0082.svg",
          "kind": "scene",
          "altEn": "Someone points out a missed warning and their colleague thanks them for the alert.",
          "altJa": "見落としの指摘に感謝。問題や見落としを知らせてもらった場面。",
          "sceneEn": "Appreciating a useful alert",
          "sceneJa": "見落としの指摘に感謝"
        }
      },
      "icon": "",
      "tags": [
        "professional",
        "thanks",
        "feedback"
      ]
    }
  },
  {
    "id": "phrase-l30-01",
    "category": "phrases",
    "level": 30,
    "before_fields": {
      "title_en": "Looking back, I would have approached it differently.",
      "title_ja": "振り返ると、今なら別のやり方で取り組むと思います。",
      "content": {
        "phrase": "Looking back, I would have approached it differently.",
        "japanese": "振り返ると、今なら別のやり方で取り組むと思います。",
        "situation": "過去の判断から学んだことを話すとき",
        "naturalUsage": "looking back で現在からの振り返りを示し、仮定法で別の可能性を述べます。",
        "exampleDialogue": "A: Would you run the project the same way again? B: Looking back, I would have approached it differently.",
        "commonMistake": "過去の反実仮想には would approach ではなく would have approached を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "reflection",
        "hypothetical",
        "learning"
      ]
    },
    "after_fields": {
      "title_en": "Looking back, I would have approached it differently.",
      "title_ja": "振り返ると、別のやり方で取り組めばよかったと思います。",
      "content": {
        "phrase": "Looking back, I would have approached it differently.",
        "japanese": "振り返ると、別のやり方で取り組めばよかったと思います。",
        "situation": "過去の判断から学んだことを話すとき",
        "naturalUsage": "looking back で現在からの振り返りを示し、仮定法で別の可能性を述べます。",
        "exampleDialogue": "A: Now that you've seen the results, would you have made the same choices? B: Looking back, I would have approached it differently.",
        "commonMistake": "過去の反実仮想には would approach ではなく would have approached を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-78f86d9a2a6f7abe.svg",
          "kind": "contrast",
          "altEn": "A person reflects on yesterday's approach and considers how they would change it now.",
          "altJa": "過去の進め方を振り返る。過去の判断から学んだことを話す場面。",
          "sceneEn": "Reflecting on a past approach",
          "sceneJa": "過去の進め方を振り返る"
        }
      },
      "icon": "",
      "tags": [
        "reflection",
        "hypothetical",
        "learning"
      ]
    }
  },
  {
    "id": "phrase-l30-02",
    "category": "phrases",
    "level": 30,
    "before_fields": {
      "title_en": "The experience changed how I think about success.",
      "title_ja": "その経験で、成功に対する考え方が変わりました。",
      "content": {
        "phrase": "The experience changed how I think about success.",
        "japanese": "その経験で、成功に対する考え方が変わりました。",
        "situation": "経験による価値観の変化を説明するとき",
        "naturalUsage": "how I think about ... で、あるテーマへの考え方を自然に表します。",
        "exampleDialogue": "A: What did you learn from the competition? B: The experience changed how I think about success.",
        "commonMistake": "changed my thinking way ではなく、changed how I think と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "reflection",
        "values",
        "experience"
      ]
    },
    "after_fields": {
      "title_en": "The experience changed how I think about success.",
      "title_ja": "その経験で、成功に対する考え方が変わりました。",
      "content": {
        "phrase": "The experience changed how I think about success.",
        "japanese": "その経験で、成功に対する考え方が変わりました。",
        "situation": "経験による価値観の変化を説明するとき",
        "naturalUsage": "how I think about ... で、あるテーマへの考え方を自然に表します。",
        "exampleDialogue": "A: What did you learn from the competition? B: The experience changed how I think about success.",
        "commonMistake": "changed my thinking way ではなく、changed how I think と言います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-af7ecbfbbeff3204.svg",
          "kind": "contrast",
          "altEn": "An individual prize is contrasted with the satisfaction of shared growth and teamwork.",
          "altJa": "成功の意味を考え直す。経験による価値観の変化を説明する場面。",
          "sceneEn": "Reconsidering the meaning of success",
          "sceneJa": "成功の意味を考え直す"
        }
      },
      "icon": "",
      "tags": [
        "reflection",
        "values",
        "experience"
      ]
    }
  },
  {
    "id": "phrase-l30-03",
    "category": "phrases",
    "level": 30,
    "before_fields": {
      "title_en": "There isn't always a clear-cut answer.",
      "title_ja": "いつも明確な答えがあるとは限りません。",
      "content": {
        "phrase": "There isn't always a clear-cut answer.",
        "japanese": "いつも明確な答えがあるとは限りません。",
        "situation": "複雑で単純に判断できない問題を話すとき",
        "naturalUsage": "clear-cut は境界や答えがはっきりしているという意味の形容詞です。",
        "exampleDialogue": "A: Which choice is morally right? B: There isn't always a clear-cut answer.",
        "commonMistake": "not always は「いつもではない」であり、「決してない」という意味ではありません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "abstract",
        "nuance",
        "discussion"
      ]
    },
    "after_fields": {
      "title_en": "There isn't always a clear-cut answer.",
      "title_ja": "いつも明確な答えがあるとは限りません。",
      "content": {
        "phrase": "There isn't always a clear-cut answer.",
        "japanese": "いつも明確な答えがあるとは限りません。",
        "situation": "複雑で単純に判断できない問題を話すとき",
        "naturalUsage": "clear-cut は境界や答えがはっきりしているという意味の形容詞です。",
        "exampleDialogue": "A: Which choice is morally right? B: There isn't always a clear-cut answer.",
        "commonMistake": "not always は「いつもではない」であり、「決してない」という意味ではありません。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-29e19d6a31bdbe01.svg",
          "kind": "contrast",
          "altEn": "A planned road could improve travel but affect green space, leaving a resident with a difficult decision.",
          "altJa": "地域の難しい選択。複雑で単純に判断できない問題を話す場面。",
          "sceneEn": "Weighing a neighbourhood decision",
          "sceneJa": "地域の難しい選択"
        }
      },
      "icon": "",
      "tags": [
        "abstract",
        "nuance",
        "discussion"
      ]
    }
  },
  {
    "id": "phrase-l30-04",
    "category": "phrases",
    "level": 30,
    "before_fields": {
      "title_en": "What matters most is how we respond.",
      "title_ja": "最も大切なのは、私たちがどう対応するかです。",
      "content": {
        "phrase": "What matters most is how we respond.",
        "japanese": "最も大切なのは、私たちがどう対応するかです。",
        "situation": "困難への姿勢を重視すると伝えるとき",
        "naturalUsage": "What matters most is ... で重要な点を強調できます。",
        "exampleDialogue": "A: We can't undo the mistake. B: True. What matters most is how we respond.",
        "commonMistake": "What is most important is ... も正しいですが、matters most はより会話的です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "reflection",
        "values",
        "response"
      ]
    },
    "after_fields": {
      "title_en": "What matters most is how we respond.",
      "title_ja": "最も大切なのは、私たちがどう対応するかです。",
      "content": {
        "phrase": "What matters most is how we respond.",
        "japanese": "最も大切なのは、私たちがどう対応するかです。",
        "situation": "困難への姿勢を重視すると伝えるとき",
        "naturalUsage": "What matters most is ... で重要な点を強調できます。",
        "exampleDialogue": "A: We can't undo the mistake. B: True. What matters most is how we respond.",
        "commonMistake": "What is most important is ... も正しいですが、matters most はより会話的です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-407a3724b4dc76d2.svg",
          "kind": "sequence",
          "altEn": "After a spill, people respond by helping to clean up instead of blaming each other.",
          "altJa": "困難にどう対応するか。困難への姿勢を重視すると伝える場面。",
          "sceneEn": "Choosing a response to difficulty",
          "sceneJa": "困難にどう対応するか"
        }
      },
      "icon": "",
      "tags": [
        "reflection",
        "values",
        "response"
      ]
    }
  },
  {
    "id": "phrase-l31-01",
    "category": "phrases",
    "level": 31,
    "before_fields": {
      "title_en": "I can see both sides of the argument.",
      "title_ja": "その議論については、双方の立場が分かります。",
      "content": {
        "phrase": "I can see both sides of the argument.",
        "japanese": "その議論については、双方の立場が分かります。",
        "situation": "対立する二つの意見にそれぞれ理由があるとき",
        "naturalUsage": "中立的な視点を示し、単純な賛否を避ける表現です。",
        "exampleDialogue": "A: Should homework be optional? B: I can see both sides of the argument.",
        "commonMistake": "both side ではなく、複数形の both sides とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "nuance",
        "debate",
        "perspective"
      ]
    },
    "after_fields": {
      "title_en": "I can see both sides of the argument.",
      "title_ja": "その議論については、双方の立場が分かります。",
      "content": {
        "phrase": "I can see both sides of the argument.",
        "japanese": "その議論については、双方の立場が分かります。",
        "situation": "対立する二つの意見にそれぞれ理由があるとき",
        "naturalUsage": "中立的な視点を示し、単純な賛否を避ける表現です。",
        "exampleDialogue": "A: Should homework be optional? B: I can see both sides of the argument.",
        "commonMistake": "both side ではなく、複数形の both sides とします。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-794d170fb758385f.svg",
          "kind": "contrast",
          "altEn": "A group considers both faster journeys on a new road and the need to protect a nearby park.",
          "altJa": "新しい道路について議論。対立する二つの意見にそれぞれ理由がある場面。",
          "sceneEn": "Debating a new road",
          "sceneJa": "新しい道路について議論"
        }
      },
      "icon": "",
      "tags": [
        "nuance",
        "debate",
        "perspective"
      ]
    }
  },
  {
    "id": "phrase-l31-02",
    "category": "phrases",
    "level": 31,
    "before_fields": {
      "title_en": "That's true to an extent.",
      "title_ja": "それはある程度そのとおりです。",
      "content": {
        "phrase": "That's true to an extent.",
        "japanese": "それはある程度そのとおりです。",
        "situation": "相手の主張を部分的に認めるとき",
        "naturalUsage": "同意の範囲に限りがあることを簡潔に示します。",
        "exampleDialogue": "A: Technology always makes life easier. B: That's true to an extent.",
        "commonMistake": "to some extent も自然です。to an extent はやや簡潔な形です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "nuance",
        "partial-agreement",
        "discussion"
      ]
    },
    "after_fields": {
      "title_en": "That's true to an extent.",
      "title_ja": "それはある程度そのとおりです。",
      "content": {
        "phrase": "That's true to an extent.",
        "japanese": "それはある程度そのとおりです。",
        "situation": "相手の主張を部分的に認めるとき",
        "naturalUsage": "同意の範囲に限りがあることを簡潔に示します。",
        "exampleDialogue": "A: Technology always makes life easier. B: That's true to an extent.",
        "commonMistake": "to some extent も自然です。to an extent はやや簡潔な形です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-2c65cfab80d45850.svg",
          "kind": "contrast",
          "altEn": "A learner agrees that workbook practice helps, while qualifying that it explains only part of progress.",
          "altJa": "学習に役立つことを相談。相手の主張を部分的に認める場面。",
          "sceneEn": "Discussing what helps learning",
          "sceneJa": "学習に役立つことを相談"
        }
      },
      "icon": "",
      "tags": [
        "nuance",
        "partial-agreement",
        "discussion"
      ]
    }
  },
  {
    "id": "phrase-l31-03",
    "category": "phrases",
    "level": 31,
    "before_fields": {
      "title_en": "The issue is more subtle than it first appears.",
      "title_ja": "その問題は一見したよりも微妙で複雑です。",
      "content": {
        "phrase": "The issue is more subtle than it first appears.",
        "japanese": "その問題は一見したよりも微妙で複雑です。",
        "situation": "表面的な理解では不十分だと指摘するとき",
        "naturalUsage": "first appears で第一印象と詳しく見た結果の違いを表します。",
        "exampleDialogue": "A: It seems like a simple pricing problem. B: The issue is more subtle than it first appears.",
        "commonMistake": "subtle は単に difficult ではなく、見分けにくい細かな違いや複雑さを含みます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "nuance",
        "analysis",
        "complexity"
      ]
    },
    "after_fields": {
      "title_en": "The issue is more subtle than it first appears.",
      "title_ja": "その問題は一見したよりも微妙で複雑です。",
      "content": {
        "phrase": "The issue is more subtle than it first appears.",
        "japanese": "その問題は一見したよりも微妙で複雑です。",
        "situation": "表面的な理解では不十分だと指摘するとき",
        "naturalUsage": "first appears で第一印象と詳しく見た結果の違いを表します。",
        "exampleDialogue": "A: It seems like a simple pricing problem. B: The issue is more subtle than it first appears.",
        "commonMistake": "subtle は単に difficult ではなく、見分けにくい細かな違いや複雑さを含みます。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-15e9393a7d80c51c.svg",
          "kind": "sequence",
          "altEn": "A tree seen at first glance is examined more closely to reveal the roots beneath it.",
          "altJa": "微妙な問題を詳しく見る。表面的な理解では不十分だと指摘する場面。",
          "sceneEn": "Looking more closely at a subtle issue",
          "sceneJa": "微妙な問題を詳しく見る"
        }
      },
      "icon": "",
      "tags": [
        "nuance",
        "analysis",
        "complexity"
      ]
    }
  },
  {
    "id": "phrase-l31-04",
    "category": "phrases",
    "level": 31,
    "before_fields": {
      "title_en": "I wouldn't go so far as to say that.",
      "title_ja": "そこまで言い切るつもりはありません。",
      "content": {
        "phrase": "I wouldn't go so far as to say that.",
        "japanese": "そこまで言い切るつもりはありません。",
        "situation": "相手の結論が強すぎるとやわらかく反論するとき",
        "naturalUsage": "一部は認めつつ、その強い言い方までは支持しないことを示します。",
        "exampleDialogue": "A: So the entire plan was a failure? B: I wouldn't go so far as to say that.",
        "commonMistake": "far は物理的距離ではなく、意見をどこまで強く述べるかの比喩です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "nuance",
        "disagreement",
        "diplomacy"
      ]
    },
    "after_fields": {
      "title_en": "I wouldn't go so far as to say that.",
      "title_ja": "そこまで言い切るつもりはありません。",
      "content": {
        "phrase": "I wouldn't go so far as to say that.",
        "japanese": "そこまで言い切るつもりはありません。",
        "situation": "相手の結論が強すぎるとやわらかく反論するとき",
        "naturalUsage": "一部は認めつつ、その強い言い方までは支持しないことを示します。",
        "exampleDialogue": "A: So the entire plan was a failure? B: I wouldn't go so far as to say that.",
        "commonMistake": "far は物理的距離ではなく、意見をどこまで強く述べるかの比喩です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-14395a7c62461fb3.svg",
          "kind": "contrast",
          "altEn": "An exaggerated claim of being the best is qualified by showing a first painting and further practice.",
          "altJa": "強すぎる評価をやわらげる。相手の結論が強すぎるとやわらかく反論する場面。",
          "sceneEn": "Responding to an exaggerated claim",
          "sceneJa": "強すぎる評価をやわらげる"
        }
      },
      "icon": "",
      "tags": [
        "nuance",
        "disagreement",
        "diplomacy"
      ]
    }
  },
  {
    "id": "phrase-l32-01",
    "category": "phrases",
    "level": 32,
    "before_fields": {
      "title_en": "To put it another way, we're treating the symptom, not the cause.",
      "title_ja": "言い換えると、原因ではなく症状に対処しているだけです。",
      "content": {
        "phrase": "To put it another way, we're treating the symptom, not the cause.",
        "japanese": "言い換えると、原因ではなく症状に対処しているだけです。",
        "situation": "複雑な考えを言い換えて核心を示すとき",
        "naturalUsage": "To put it another way で、前の説明を別の角度から明確にします。",
        "exampleDialogue": "A: Why isn't the quick fix enough? B: To put it another way, we're treating the symptom, not the cause.",
        "commonMistake": "put it in another way も通じますが、定型表現は put it another way です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "advanced",
        "rephrasing",
        "analysis"
      ]
    },
    "after_fields": {
      "title_en": "To put it another way, we're treating the symptom, not the cause.",
      "title_ja": "言い換えると、原因ではなく症状に対処しているだけです。",
      "content": {
        "phrase": "To put it another way, we're treating the symptom, not the cause.",
        "japanese": "言い換えると、原因ではなく症状に対処しているだけです。",
        "situation": "複雑な考えを言い換えて核心を示すとき",
        "naturalUsage": "To put it another way で、前の説明を別の角度から明確にします。",
        "exampleDialogue": "A: Why isn't the quick fix enough? B: To put it another way, we're treating the symptom, not the cause.",
        "commonMistake": "To put it another way は言い換えの合図です。put の目的語 it を落とさず、put it another way とまとめて使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-2048ca1a81919c69.svg",
          "kind": "contrast",
          "altEn": "Visible damage on a plant is distinguished from the roots where its cause may lie.",
          "altJa": "症状と原因を区別。複雑な考えを言い換えて核心を示す場面。",
          "sceneEn": "Distinguishing symptoms and causes",
          "sceneJa": "症状と原因を区別"
        }
      },
      "icon": "",
      "tags": [
        "advanced",
        "rephrasing",
        "analysis"
      ]
    }
  },
  {
    "id": "phrase-l32-02",
    "category": "phrases",
    "level": 32,
    "before_fields": {
      "title_en": "I don't have a firm view on that yet.",
      "title_ja": "それについては、まだはっきりした意見がありません。",
      "content": {
        "phrase": "I don't have a firm view on that yet.",
        "japanese": "それについては、まだはっきりした意見がありません。",
        "situation": "情報不足で立場を決めていないとき",
        "naturalUsage": "無知ではなく、判断を保留していることを落ち着いて伝えます。",
        "exampleDialogue": "A: Do you support the proposed change? B: I don't have a firm view on that yet.",
        "commonMistake": "I have no opinion. は関心がないようにも響くため、この表現はより慎重です。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "advanced",
        "uncertainty",
        "opinion"
      ]
    },
    "after_fields": {
      "title_en": "I don't have a firm view on that yet.",
      "title_ja": "それについては、まだはっきりした意見がありません。",
      "content": {
        "phrase": "I don't have a firm view on that yet.",
        "japanese": "それについては、まだはっきりした意見がありません。",
        "situation": "情報不足で立場を決めていないとき",
        "naturalUsage": "yet を添えて、今は判断を保留しているが、今後考えがまとまる可能性を示します。",
        "exampleDialogue": "A: Do you support the proposed change? B: I don't have a firm view on that yet.",
        "commonMistake": "I have no opinion. も正しい表現です。この文の firm view は「考えが固まった意見」を表します。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-967a3d751fb2fc09.svg",
          "kind": "scene",
          "altEn": "A person reviews information and keeps their view open while questions remain.",
          "altJa": "まだ立場を決めない。情報不足で立場を決めていない場面。",
          "sceneEn": "Keeping an open position",
          "sceneJa": "まだ立場を決めない"
        }
      },
      "icon": "",
      "tags": [
        "advanced",
        "uncertainty",
        "opinion"
      ]
    }
  },
  {
    "id": "phrase-l32-03",
    "category": "phrases",
    "level": 32,
    "before_fields": {
      "title_en": "That raises a broader question about who benefits.",
      "title_ja": "それによって、誰が利益を得るのかという、より広い問いが生まれます。",
      "content": {
        "phrase": "That raises a broader question about who benefits.",
        "japanese": "それによって、誰が利益を得るのかという、より広い問いが生まれます。",
        "situation": "個別の話題からより大きな論点へ広げるとき",
        "naturalUsage": "raise a question は、検討すべき問いを生じさせるという意味です。",
        "exampleDialogue": "A: The service will collect more user data. B: That raises a broader question about who benefits.",
        "commonMistake": "rise a question ではなく、他動詞 raise a question を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "advanced",
        "critical-thinking",
        "discussion"
      ]
    },
    "after_fields": {
      "title_en": "That raises a broader question about who benefits.",
      "title_ja": "それによって、誰が利益を得るのかという、より広い問いが生まれます。",
      "content": {
        "phrase": "That raises a broader question about who benefits.",
        "japanese": "それによって、誰が利益を得るのかという、より広い問いが生まれます。",
        "situation": "個別の話題からより大きな論点へ広げるとき",
        "naturalUsage": "raise a question は、検討すべき問いを生じさせるという意味です。",
        "exampleDialogue": "A: The service will collect more user data. B: That raises a broader question about who benefits.",
        "commonMistake": "rise a question ではなく、他動詞 raise a question を使います。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-fd08c7986f04aef5.svg",
          "kind": "scene",
          "altEn": "A group considers who receives the benefits of a proposal and how they are shared.",
          "altJa": "誰の利益になるか考える。個別の話題からより大きな論点へ広げる場面。",
          "sceneEn": "Asking who benefits",
          "sceneJa": "誰の利益になるか考える"
        }
      },
      "icon": "",
      "tags": [
        "advanced",
        "critical-thinking",
        "discussion"
      ]
    }
  },
  {
    "id": "phrase-l32-04",
    "category": "phrases",
    "level": 32,
    "before_fields": {
      "title_en": "We may need to rethink the assumptions behind our plan.",
      "title_ja": "計画の前提そのものを見直す必要があるかもしれません。",
      "content": {
        "phrase": "We may need to rethink the assumptions behind our plan.",
        "japanese": "計画の前提そのものを見直す必要があるかもしれません。",
        "situation": "計画の土台となる考えに疑問を投げかけるとき",
        "naturalUsage": "失敗を責めるのではなく、前提から再検討する必要性を提案します。",
        "exampleDialogue": "A: None of our predictions matched the results. B: We may need to rethink the assumptions behind our plan.",
        "commonMistake": "rethink about the assumptions ではなく、rethink the assumptions と直接目的語を取ります。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "💬",
      "tags": [
        "advanced",
        "strategy",
        "reflection"
      ]
    },
    "after_fields": {
      "title_en": "We may need to rethink the assumptions behind our plan.",
      "title_ja": "計画の前提そのものを見直す必要があるかもしれません。",
      "content": {
        "phrase": "We may need to rethink the assumptions behind our plan.",
        "japanese": "計画の前提そのものを見直す必要があるかもしれません。",
        "situation": "計画の土台となる考えに疑問を投げかけるとき",
        "naturalUsage": "失敗を責めるのではなく、前提から再検討する必要性を提案します。",
        "exampleDialogue": "A: None of our predictions matched the results. B: We may need to rethink the assumptions behind our plan.",
        "commonMistake": "rethink about the assumptions ではなく、rethink the assumptions と直接目的語を取ります。",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "imageType": "licensed-illustration",
        "visual": {
          "src": "/assets/curriculum/phrases-a2c32899793f65c0.svg",
          "kind": "sequence",
          "altEn": "A team examines the foundations of its plan and reconsiders the assumptions behind it.",
          "altJa": "計画の前提を見直す。計画の土台となる考えに疑問を投げかける場面。",
          "sceneEn": "Revisiting a plan's assumptions",
          "sceneJa": "計画の前提を見直す"
        }
      },
      "icon": "",
      "tags": [
        "advanced",
        "strategy",
        "reflection"
      ]
    }
  },
  {
    "id": "phonics-l01",
    "category": "phonics",
    "level": 1,
    "before_fields": {
      "title_en": "First alphabet sounds: m, s, t, p",
      "title_ja": "文字の名前ではなく、単語の最初に聞こえる短い音を意識します。mは唇を閉じ、sは息を細く出します。",
      "content": {
        "phonicsTarget": "First alphabet sounds: m, s, t, p",
        "sound": "/m/, /s/, /t/, /p/",
        "examples": [
          "moon",
          "sun",
          "top",
          "pen"
        ],
        "japaneseHint": "文字の名前ではなく、単語の最初に聞こえる短い音を意識します。mは唇を閉じ、sは息を細く出します。",
        "mouthTip": "Close both lips for /m/. For /s/, keep a narrow air channel. Release /t/ and /p/ without adding a vowel.",
        "practiceWords": [
          "map",
          "sip",
          "tap",
          "pot"
        ],
        "practiceSentence": "Sam taps the map.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "First alphabet sounds: m, s, t, p",
      "title_ja": "文字の名前ではなく、単語の最初に聞こえる短い音を意識します。mは唇を閉じ、sは息を細く出します。",
      "content": {
        "phonicsTarget": "First alphabet sounds: m, s, t, p",
        "sound": "/m/, /s/, /t/, /p/",
        "examples": [
          "moon",
          "sun",
          "top",
          "pen"
        ],
        "japaneseHint": "文字の名前ではなく、単語の最初に聞こえる短い音を意識します。mは唇を閉じ、sは息を細く出します。",
        "mouthTip": "Close both lips for /m/. For /s/, keep a narrow air channel. Release /t/ and /p/ without adding a vowel.",
        "practiceWords": [
          "map",
          "sip",
          "tap",
          "pot"
        ],
        "practiceSentence": "Sam taps the map.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen for the first sounds in moon, sun, top, and pen.",
        "contrastPairs": [
          [
            "top",
            "pop"
          ],
          [
            "map",
            "sap"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l02",
    "category": "phonics",
    "level": 2,
    "before_fields": {
      "title_en": "Alphabet sounds: n, b, d, g",
      "title_ja": "nは舌先、bは両唇、dは上の歯ぐき、gは喉の奥を使います。後ろに「ウ」を足さないようにします。",
      "content": {
        "phonicsTarget": "Alphabet sounds: n, b, d, g",
        "sound": "/n/, /b/, /d/, /g/",
        "examples": [
          "net",
          "bag",
          "dog",
          "gum"
        ],
        "japaneseHint": "nは舌先、bは両唇、dは上の歯ぐき、gは喉の奥を使います。後ろに「ウ」を足さないようにします。",
        "mouthTip": "Touch the ridge behind your upper teeth for /n/ and /d/. Close the lips for /b/ and use the back of the tongue for /g/.",
        "practiceWords": [
          "nod",
          "bed",
          "dig",
          "big"
        ],
        "practiceSentence": "Ben digs by the big bed.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Alphabet sounds: n, b, d, g",
      "title_ja": "nは舌先、bは両唇、dは上の歯ぐき、gは喉の奥を使います。後ろに「ウ」を足さないようにします。",
      "content": {
        "phonicsTarget": "Alphabet sounds: n, b, d, g",
        "sound": "/n/, /b/, /d/, /g/",
        "examples": [
          "net",
          "bag",
          "dog",
          "gum"
        ],
        "japaneseHint": "nは舌先、bは両唇、dは上の歯ぐき、gは喉の奥を使います。後ろに「ウ」を足さないようにします。",
        "mouthTip": "Touch the ridge behind your upper teeth for /n/ and /d/. Close the lips for /b/ and use the back of the tongue for /g/.",
        "practiceWords": [
          "nod",
          "bed",
          "dig",
          "big"
        ],
        "practiceSentence": "Ben digs by the big bed.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen for the first sounds in net, bag, dog, and gum.",
        "contrastPairs": [
          [
            "net",
            "bet"
          ],
          [
            "bag",
            "nag"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l03",
    "category": "phonics",
    "level": 3,
    "before_fields": {
      "title_en": "Breathy and voiced consonants: f, v, h, w",
      "title_ja": "fとvは上の歯を下唇に軽く当てます。vでは喉を震わせます。hは息、wは丸い唇から始めます。",
      "content": {
        "phonicsTarget": "Breathy and voiced consonants: f, v, h, w",
        "sound": "/f/, /v/, /h/, /w/",
        "examples": [
          "fan",
          "van",
          "hat",
          "wet"
        ],
        "japaneseHint": "fとvは上の歯を下唇に軽く当てます。vでは喉を震わせます。hは息、wは丸い唇から始めます。",
        "mouthTip": "Let air pass between the upper teeth and lower lip for /f/ and /v/. Voice only /v/. Round the lips before /w/.",
        "practiceWords": [
          "fine",
          "vine",
          "hop",
          "win"
        ],
        "practiceSentence": "We have five hats.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Breathy and voiced consonants: f, v, h, w",
      "title_ja": "fとvは上の歯を下唇に軽く当てます。vでは喉を震わせます。hは息、wは丸い唇から始めます。",
      "content": {
        "phonicsTarget": "Breathy and voiced consonants: f, v, h, w",
        "sound": "/f/, /v/, /h/, /w/",
        "examples": [
          "fan",
          "van",
          "hat",
          "wet"
        ],
        "japaneseHint": "fとvは上の歯を下唇に軽く当てます。vでは喉を震わせます。hは息、wは丸い唇から始めます。",
        "mouthTip": "Let air pass between the upper teeth and lower lip for /f/ and /v/. Voice only /v/. Round the lips before /w/.",
        "practiceWords": [
          "fine",
          "vine",
          "hop",
          "win"
        ],
        "practiceSentence": "We have five hats.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to fan and van. Feel your voice start in van.",
        "contrastPairs": [
          [
            "fan",
            "van"
          ],
          [
            "wet",
            "vet"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l04",
    "category": "phonics",
    "level": 4,
    "before_fields": {
      "title_en": "Remaining common alphabet sounds: c, k, j, z, y, x, q",
      "title_ja": "cはcatでは/k/、jは/dʒ/、yはyesの短い子音です。xは多くの場合/k/と/s/を続けます。",
      "content": {
        "phonicsTarget": "Remaining common alphabet sounds: c, k, j, z, y, x, q",
        "sound": "/k/, /dʒ/, /z/, /j/, /ks/, /kw/",
        "examples": [
          "cat",
          "kite",
          "jam",
          "zip",
          "yes",
          "box",
          "quiz"
        ],
        "japaneseHint": "cはcatでは/k/、jは/dʒ/、yはyesの短い子音です。xは多くの場合/k/と/s/を続けます。",
        "mouthTip": "Use the back of the tongue for /k/. Round the lips while starting /kw/. Keep /ks/ together at the end of a word.",
        "practiceWords": [
          "cup",
          "kid",
          "jet",
          "zoo",
          "yak",
          "fox",
          "quit"
        ],
        "practiceSentence": "The quick fox can jump.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "L and r, plus c, k, j, z, y, x, and q",
      "title_ja": "lは舌先を上の歯ぐきにつけ、rでは舌を後ろへ引いて上につけません。cはcatでは/k/、xはboxでは/ks/、qはquizでは/kw/です。",
      "content": {
        "phonicsTarget": "L and r, plus c, k, j, z, y, x, and q",
        "sound": "/l/, /r/, /k/, /dʒ/, /z/, /j/, /ks/, /kw/",
        "examples": [
          "light",
          "right",
          "cat",
          "kite",
          "jam",
          "zip",
          "yes",
          "box",
          "quiz"
        ],
        "japaneseHint": "lは舌先を上の歯ぐきにつけ、rでは舌を後ろへ引いて上につけません。cはcatでは/k/、xはboxでは/ks/、qはquizでは/kw/です。",
        "mouthTip": "For /l/, touch the ridge behind the upper teeth with the tongue tip. For /r/, raise or bunch the tongue without touching the roof. Use the back of the tongue for /k/ and keep final /ks/ together.",
        "practiceWords": [
          "lip",
          "rip",
          "cup",
          "kid",
          "jet",
          "zoo",
          "yak",
          "fox",
          "quit"
        ],
        "practiceSentence": "Look right at the red fox.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to light and right. Then try the other first and last sounds.",
        "contrastPairs": [
          [
            "light",
            "right"
          ],
          [
            "zip",
            "sip"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l05",
    "category": "phonics",
    "level": 5,
    "before_fields": {
      "title_en": "Short a in closed syllables",
      "title_ja": "日本語の「ア」より口を横にも開き、明るく短く発音します。",
      "content": {
        "phonicsTarget": "Short a in closed syllables",
        "sound": "/æ/",
        "examples": [
          "cat",
          "map",
          "hand",
          "bag"
        ],
        "japaneseHint": "日本語の「ア」より口を横にも開き、明るく短く発音します。",
        "mouthTip": "Lower the jaw, spread the lips slightly, and keep the tongue low and forward.",
        "practiceWords": [
          "cap",
          "jam",
          "flag",
          "stand"
        ],
        "practiceSentence": "A black cat sat on the mat.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Short a in closed syllables",
      "title_ja": "日本語の「ア」より口を横にも開き、明るく短く発音します。",
      "content": {
        "phonicsTarget": "Short a in closed syllables",
        "sound": "/æ/",
        "examples": [
          "cat",
          "map",
          "hand",
          "bag"
        ],
        "japaneseHint": "日本語の「ア」より口を横にも開き、明るく短く発音します。",
        "mouthTip": "Lower the jaw, spread the lips slightly, and keep the tongue low and forward.",
        "practiceWords": [
          "cap",
          "jam",
          "flag",
          "stand"
        ],
        "practiceSentence": "A black cat sat on the mat.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the short vowel in cat.",
        "contrastPairs": [
          [
            "cat",
            "cut"
          ],
          [
            "cap",
            "cup"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l06",
    "category": "phonics",
    "level": 6,
    "before_fields": {
      "title_en": "Short i in closed syllables",
      "title_ja": "「イー」と伸ばさず、力を抜いた短い「イ」にします。",
      "content": {
        "phonicsTarget": "Short i in closed syllables",
        "sound": "/ɪ/",
        "examples": [
          "sit",
          "fish",
          "milk",
          "ring"
        ],
        "japaneseHint": "「イー」と伸ばさず、力を抜いた短い「イ」にします。",
        "mouthTip": "Keep the jaw relaxed and the tongue high but loose. End quickly without smiling too widely.",
        "practiceWords": [
          "pin",
          "ship",
          "gift",
          "swim"
        ],
        "practiceSentence": "Six fish swim in the river.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Short i in closed syllables",
      "title_ja": "「イー」と伸ばさず、力を抜いた短い「イ」にします。",
      "content": {
        "phonicsTarget": "Short i in closed syllables",
        "sound": "/ɪ/",
        "examples": [
          "sit",
          "fish",
          "milk",
          "ring"
        ],
        "japaneseHint": "「イー」と伸ばさず、力を抜いた短い「イ」にします。",
        "mouthTip": "Keep the jaw relaxed and the tongue high but loose. End quickly without smiling too widely.",
        "practiceWords": [
          "pin",
          "ship",
          "gift",
          "swim"
        ],
        "practiceSentence": "Six fish swim in the river.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the short vowel in sit.",
        "contrastPairs": [
          [
            "ship",
            "sheep"
          ],
          [
            "sit",
            "seat"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l07",
    "category": "phonics",
    "level": 7,
    "before_fields": {
      "title_en": "Short o in closed syllables",
      "title_ja": "UKでは唇を少し丸めた短い音、USでは口を大きく開く音になりやすいです。",
      "content": {
        "phonicsTarget": "Short o in closed syllables",
        "sound": "/ɒ/ (UK), /ɑ/ (US)",
        "examples": [
          "hot",
          "box",
          "clock",
          "stop"
        ],
        "japaneseHint": "UKでは唇を少し丸めた短い音、USでは口を大きく開く音になりやすいです。",
        "mouthTip": "Drop the jaw and keep the sound short. Use slightly rounder lips for the common UK pronunciation.",
        "practiceWords": [
          "log",
          "shop",
          "rock",
          "pond"
        ],
        "practiceSentence": "Tom drops the box by the clock.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Short o in closed syllables",
      "title_ja": "UKでは唇を少し丸めた短い音、USでは口を大きく開く音になりやすいです。",
      "content": {
        "phonicsTarget": "Short o in closed syllables",
        "sound": "/ɒ/ (UK), /ɑ/ (US)",
        "examples": [
          "hot",
          "box",
          "clock",
          "stop"
        ],
        "japaneseHint": "UKでは唇を少し丸めた短い音、USでは口を大きく開く音になりやすいです。",
        "mouthTip": "Drop the jaw and keep the sound short. Use slightly rounder lips for the common UK pronunciation.",
        "practiceWords": [
          "log",
          "shop",
          "rock",
          "pond"
        ],
        "practiceSentence": "Tom drops the box by the clock.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the vowel in hot. Notice how each accent sounds.",
        "contrastPairs": [
          [
            "hot",
            "hut"
          ],
          [
            "cot",
            "cut"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l08",
    "category": "phonics",
    "level": 8,
    "before_fields": {
      "title_en": "Short e in closed syllables",
      "title_ja": "「イ」にならないよう、口を少し開けて短い「エ」にします。",
      "content": {
        "phonicsTarget": "Short e in closed syllables",
        "sound": "/e/ or /ɛ/",
        "examples": [
          "bed",
          "pen",
          "head",
          "step"
        ],
        "japaneseHint": "「イ」にならないよう、口を少し開けて短い「エ」にします。",
        "mouthTip": "Keep the tongue at mid height and the lips relaxed. Do not glide toward /iː/.",
        "practiceWords": [
          "red",
          "desk",
          "left",
          "next"
        ],
        "practiceSentence": "Meg left her red pen on the desk.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Short e in closed syllables",
      "title_ja": "「イ」にならないよう、口を少し開けて短い「エ」にします。",
      "content": {
        "phonicsTarget": "Short e in closed syllables",
        "sound": "/e/ or /ɛ/",
        "examples": [
          "bed",
          "pen",
          "head",
          "step"
        ],
        "japaneseHint": "「イ」にならないよう、口を少し開けて短い「エ」にします。",
        "mouthTip": "Keep the tongue at mid height and the lips relaxed. Do not glide toward /iː/.",
        "practiceWords": [
          "red",
          "desk",
          "left",
          "next"
        ],
        "practiceSentence": "Meg left her red pen on the desk.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the short vowel in bed.",
        "contrastPairs": [
          [
            "pen",
            "pin"
          ],
          [
            "bed",
            "bad"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l09",
    "category": "phonics",
    "level": 9,
    "before_fields": {
      "title_en": "Short u in closed syllables",
      "title_ja": "口を丸めず、のどの中央から短く「ア」に近い音を出します。",
      "content": {
        "phonicsTarget": "Short u in closed syllables",
        "sound": "/ʌ/",
        "examples": [
          "sun",
          "cup",
          "bus",
          "lunch"
        ],
        "japaneseHint": "口を丸めず、のどの中央から短く「ア」に近い音を出します。",
        "mouthTip": "Relax the lips and jaw. Keep the tongue central and avoid rounding as for /uː/.",
        "practiceWords": [
          "run",
          "jump",
          "duck",
          "brush"
        ],
        "practiceSentence": "The duck runs under the bus.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Short u in closed syllables",
      "title_ja": "口を丸めず、のどの中央から短く「ア」に近い音を出します。",
      "content": {
        "phonicsTarget": "Short u in closed syllables",
        "sound": "/ʌ/",
        "examples": [
          "sun",
          "cup",
          "bus",
          "lunch"
        ],
        "japaneseHint": "口を丸めず、のどの中央から短く「ア」に近い音を出します。",
        "mouthTip": "Relax the lips and jaw. Keep the tongue central and avoid rounding as for /uː/.",
        "practiceWords": [
          "run",
          "jump",
          "duck",
          "brush"
        ],
        "practiceSentence": "The duck runs under the bus.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the short vowel in sun.",
        "contrastPairs": [
          [
            "cup",
            "cap"
          ],
          [
            "luck",
            "lock"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l10",
    "category": "phonics",
    "level": 10,
    "before_fields": {
      "title_en": "CVC blending and clear final consonants",
      "title_ja": "3つの音を切り離さずにつなぎ、最後の子音の後に母音を足さない練習です。",
      "content": {
        "phonicsTarget": "CVC blending and clear final consonants",
        "sound": "consonant + short vowel + consonant",
        "examples": [
          "map",
          "sit",
          "bed",
          "hot",
          "cup"
        ],
        "japaneseHint": "3つの音を切り離さずにつなぎ、最後の子音の後に母音を足さない練習です。",
        "mouthTip": "Stretch the first two sounds just enough to connect them, then stop cleanly on the final consonant.",
        "practiceWords": [
          "tap",
          "win",
          "red",
          "hop",
          "sun"
        ],
        "practiceSentence": "Kim can hop and run.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "CVC blending and clear final consonants",
      "title_ja": "3つの音を切り離さずにつなぎ、最後の子音の後に母音を足さない練習です。",
      "content": {
        "phonicsTarget": "CVC blending and clear final consonants",
        "sound": "consonant + short vowel + consonant",
        "examples": [
          "map",
          "sit",
          "bed",
          "hot",
          "cup"
        ],
        "japaneseHint": "3つの音を切り離さずにつなぎ、最後の子音の後に母音を足さない練習です。",
        "mouthTip": "Join the first consonant to the vowel, then finish with the last consonant. Do not add a vowel after it.",
        "practiceWords": [
          "tap",
          "win",
          "red",
          "hop",
          "sun"
        ],
        "practiceSentence": "Kim can hop and run.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Join the sounds into a word. Listen for the final consonant.",
        "contrastPairs": [
          [
            "cap",
            "cat"
          ],
          [
            "hop",
            "hot"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l11",
    "category": "phonics",
    "level": 11,
    "before_fields": {
      "title_en": "L-blends at the beginning",
      "title_ja": "最初の2子音の間に「ウ」や「オ」を入れず、一息でつなぎます。",
      "content": {
        "phonicsTarget": "L-blends at the beginning",
        "sound": "/bl/, /cl/, /fl/, /gl/, /pl/, /sl/",
        "examples": [
          "blue",
          "clap",
          "flag",
          "glad",
          "plant",
          "sleep"
        ],
        "japaneseHint": "最初の2子音の間に「ウ」や「オ」を入れず、一息でつなぎます。",
        "mouthTip": "Make the first consonant briefly, then move the tongue tip directly to /l/ without releasing a vowel.",
        "practiceWords": [
          "black",
          "clock",
          "flower",
          "glass",
          "plane",
          "slow"
        ],
        "practiceSentence": "The blue flag flies above the plane.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "L-blends at the beginning",
      "title_ja": "最初の2子音の間に「ウ」や「オ」を入れず、一息でつなぎます。",
      "content": {
        "phonicsTarget": "L-blends at the beginning",
        "sound": "/bl/, /kl/, /fl/, /gl/, /pl/, /sl/",
        "examples": [
          "blue",
          "clap",
          "flag",
          "glad",
          "plant",
          "sleep"
        ],
        "japaneseHint": "最初の2子音の間に「ウ」や「オ」を入れず、一息でつなぎます。",
        "mouthTip": "Make the first consonant briefly, then move the tongue tip directly to /l/ without releasing a vowel.",
        "practiceWords": [
          "black",
          "clock",
          "flower",
          "glass",
          "plane",
          "slow"
        ],
        "practiceSentence": "The blue flag flies above the plane.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to both consonants at the start of blue.",
        "contrastPairs": [
          [
            "play",
            "pray"
          ],
          [
            "glass",
            "grass"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l12",
    "category": "phonics",
    "level": 12,
    "before_fields": {
      "title_en": "R-blends at the beginning",
      "title_ja": "子音の直後に英語のrへ移動します。間に日本語の母音を入れません。",
      "content": {
        "phonicsTarget": "R-blends at the beginning",
        "sound": "/br/, /cr/, /dr/, /fr/, /gr/, /pr/, /tr/",
        "examples": [
          "brown",
          "crab",
          "dress",
          "frog",
          "green",
          "press",
          "tree"
        ],
        "japaneseHint": "子音の直後に英語のrへ移動します。間に日本語の母音を入れません。",
        "mouthTip": "Keep the tongue tip away from the roof of the mouth for /r/ and move into the following vowel smoothly.",
        "practiceWords": [
          "bread",
          "cry",
          "drink",
          "fresh",
          "grass",
          "prize",
          "train"
        ],
        "practiceSentence": "A green frog rests by the tree.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "R-blends at the beginning",
      "title_ja": "子音の直後に英語のrへ移動します。間に日本語の母音を入れません。",
      "content": {
        "phonicsTarget": "R-blends at the beginning",
        "sound": "/br/, /kr/, /dr/, /fr/, /gr/, /pr/, /tr/",
        "examples": [
          "brown",
          "crab",
          "dress",
          "frog",
          "green",
          "press",
          "tree"
        ],
        "japaneseHint": "子音の直後に英語のrへ移動します。間に日本語の母音を入れません。",
        "mouthTip": "Keep the tongue tip away from the roof of the mouth for /r/ and move into the following vowel smoothly.",
        "practiceWords": [
          "bread",
          "cry",
          "drink",
          "fresh",
          "grass",
          "prize",
          "train"
        ],
        "practiceSentence": "A green frog rests by the tree.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to both consonants at the start of brown.",
        "contrastPairs": [
          [
            "grass",
            "glass"
          ],
          [
            "fry",
            "fly"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l13",
    "category": "phonics",
    "level": 13,
    "before_fields": {
      "title_en": "S-blends and three-consonant starts",
      "title_ja": "sの後に母音を入れず、次の子音へすぐ移ります。streetは3子音を一続きにします。",
      "content": {
        "phonicsTarget": "S-blends and three-consonant starts",
        "sound": "/sp/, /st/, /sk/, /sm/, /sn/, /sw/, /str/",
        "examples": [
          "spin",
          "stop",
          "skin",
          "smile",
          "snow",
          "swim",
          "street"
        ],
        "japaneseHint": "sの後に母音を入れず、次の子音へすぐ移ります。streetは3子音を一続きにします。",
        "mouthTip": "Hold a thin /s/ airflow, shape the next consonant immediately, and release into the vowel only once.",
        "practiceWords": [
          "space",
          "star",
          "school",
          "small",
          "snake",
          "sweet",
          "strong"
        ],
        "practiceSentence": "The strong swimmer starts slowly.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "S-blends and three-consonant starts",
      "title_ja": "sの後に母音を入れず、次の子音へすぐ移ります。streetは3子音を一続きにします。",
      "content": {
        "phonicsTarget": "S-blends and three-consonant starts",
        "sound": "/sp/, /st/, /sk/, /sm/, /sn/, /sw/, /str/",
        "examples": [
          "spin",
          "stop",
          "skin",
          "smile",
          "snow",
          "swim",
          "street"
        ],
        "japaneseHint": "sの後に母音を入れず、次の子音へすぐ移ります。streetは3子音を一続きにします。",
        "mouthTip": "Hold a thin /s/ airflow, shape the next consonant immediately, and release into the vowel only once.",
        "practiceWords": [
          "space",
          "star",
          "school",
          "small",
          "snake",
          "sweet",
          "strong"
        ],
        "practiceSentence": "The strong swimmer starts slowly.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Keep the first consonants together. Listen to spin and street.",
        "contrastPairs": [
          [
            "spin",
            "pin"
          ],
          [
            "stop",
            "top"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l14",
    "category": "phonics",
    "level": 14,
    "before_fields": {
      "title_en": "Digraphs sh and ch",
      "title_ja": "shは息だけの「シュ」、chは最初に舌で空気を止めてから出す「チュ」に近い音です。",
      "content": {
        "phonicsTarget": "Digraphs sh and ch",
        "sound": "/ʃ/ and /tʃ/",
        "examples": [
          "ship",
          "fish",
          "chair",
          "lunch"
        ],
        "japaneseHint": "shは息だけの「シュ」、chは最初に舌で空気を止めてから出す「チュ」に近い音です。",
        "mouthTip": "Round the lips slightly for both. For /tʃ/, briefly block the air before releasing it; for /ʃ/, let air flow continuously.",
        "practiceWords": [
          "shop",
          "brush",
          "chat",
          "beach"
        ],
        "practiceSentence": "She chose fresh fish for lunch.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Digraphs sh and ch",
      "title_ja": "shは息だけの「シュ」、chは最初に舌で空気を止めてから出す「チュ」に近い音です。",
      "content": {
        "phonicsTarget": "Digraphs sh and ch",
        "sound": "/ʃ/ and /tʃ/",
        "examples": [
          "ship",
          "fish",
          "chair",
          "lunch"
        ],
        "japaneseHint": "shは息だけの「シュ」、chは最初に舌で空気を止めてから出す「チュ」に近い音です。",
        "mouthTip": "Round the lips slightly for both. For /tʃ/, briefly block the air before releasing it; for /ʃ/, let air flow continuously.",
        "practiceWords": [
          "shop",
          "brush",
          "chat",
          "beach"
        ],
        "practiceSentence": "She chose fresh fish for lunch.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to ship and chip. The start of chip has a short stop.",
        "contrastPairs": [
          [
            "ship",
            "chip"
          ],
          [
            "wash",
            "watch"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l15",
    "category": "phonics",
    "level": 15,
    "before_fields": {
      "title_en": "Voiceless and voiced th",
      "title_ja": "舌先を歯の間に軽く出します。thinkは息だけ、thisは喉を震わせます。",
      "content": {
        "phonicsTarget": "Voiceless and voiced th",
        "sound": "/θ/ and /ð/",
        "examples": [
          "think",
          "bath",
          "this",
          "mother"
        ],
        "japaneseHint": "舌先を歯の間に軽く出します。thinkは息だけ、thisは喉を震わせます。",
        "mouthTip": "Place the tongue tip gently between the teeth. Blow air for /θ/ and add voice for /ð/ without pulling the tongue back.",
        "practiceWords": [
          "three",
          "mouth",
          "that",
          "weather"
        ],
        "practiceSentence": "Those three paths are narrow.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Voiceless and voiced th",
      "title_ja": "舌先を歯の間に軽く出します。thinkは息だけ、thisは喉を震わせます。",
      "content": {
        "phonicsTarget": "Voiceless and voiced th",
        "sound": "/θ/ and /ð/",
        "examples": [
          "think",
          "bath",
          "this",
          "mother"
        ],
        "japaneseHint": "舌先を歯の間に軽く出します。thinkは息だけ、thisは喉を震わせます。",
        "mouthTip": "Place the tongue tip gently between the teeth. Blow air for /θ/ and add voice for /ð/ without pulling the tongue back.",
        "practiceWords": [
          "three",
          "mouth",
          "that",
          "weather"
        ],
        "practiceSentence": "Those three things are over there.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to think and this. Your voice starts in this.",
        "contrastPairs": [
          [
            "thin",
            "sin"
          ],
          [
            "then",
            "den"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l16",
    "category": "phonics",
    "level": 16,
    "before_fields": {
      "title_en": "Digraphs wh, ph, and ng",
      "title_ja": "whは多くの話者でw、phはf、ngは舌先を上につけず鼻へ抜く1つの音です。",
      "content": {
        "phonicsTarget": "Digraphs wh, ph, and ng",
        "sound": "/w/, /f/, /ŋ/",
        "examples": [
          "when",
          "phone",
          "sing"
        ],
        "japaneseHint": "whは多くの話者でw、phはf、ngは舌先を上につけず鼻へ抜く1つの音です。",
        "mouthTip": "Round the lips for /w/. Touch upper teeth to lower lip for /f/. For /ŋ/, lift the back of the tongue and keep the tip down.",
        "practiceWords": [
          "whale",
          "photo",
          "graph",
          "long",
          "singer"
        ],
        "practiceSentence": "When will Phil sing that long song?",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Digraphs wh, ph, and ng",
      "title_ja": "whは多くの話者でw、phはf、ngは舌先を上につけず鼻へ抜く1つの音です。",
      "content": {
        "phonicsTarget": "Digraphs wh, ph, and ng",
        "sound": "/w/, /f/, /ŋ/",
        "examples": [
          "when",
          "phone",
          "sing"
        ],
        "japaneseHint": "whは多くの話者でw、phはf、ngは舌先を上につけず鼻へ抜く1つの音です。",
        "mouthTip": "Round the lips for /w/. Touch upper teeth to lower lip for /f/. For /ŋ/, lift the back of the tongue and keep the tip down.",
        "practiceWords": [
          "whale",
          "photo",
          "graph",
          "long",
          "singer"
        ],
        "practiceSentence": "When will Phil sing that long song?",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to when, phone, and sing. Keep the end of sing smooth.",
        "contrastPairs": [
          [
            "sin",
            "sing"
          ],
          [
            "win",
            "wing"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l17",
    "category": "phonics",
    "level": 17,
    "before_fields": {
      "title_en": "Silent e makes long a",
      "title_ja": "最後のeは読まず、その前のaを文字名の/eɪ/に変えます。",
      "content": {
        "phonicsTarget": "Silent e makes long a",
        "sound": "/eɪ/ in a_e",
        "examples": [
          "cake",
          "name",
          "late",
          "game"
        ],
        "japaneseHint": "最後のeは読まず、その前のaを文字名の/eɪ/に変えます。",
        "mouthTip": "Begin with a mid-front vowel and glide upward. Keep the final consonant clear; do not pronounce the final e.",
        "practiceWords": [
          "lake",
          "same",
          "gate",
          "plane"
        ],
        "practiceSentence": "Jake made a cake by the lake.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Silent e makes long a",
      "title_ja": "最後のeは読まず、その前のaを文字名の/eɪ/に変えます。 ここでの語に共通するパターンです。have・give・loveのような例外もあります。",
      "content": {
        "phonicsTarget": "Silent e makes long a",
        "sound": "/eɪ/ in a_e",
        "examples": [
          "cake",
          "name",
          "late",
          "game"
        ],
        "japaneseHint": "最後のeは読まず、その前のaを文字名の/eɪ/に変えます。 ここでの語に共通するパターンです。have・give・loveのような例外もあります。",
        "mouthTip": "Begin with a mid-front vowel and glide upward. Keep the final consonant clear; do not pronounce the final e.",
        "practiceWords": [
          "lake",
          "same",
          "gate",
          "plane"
        ],
        "practiceSentence": "Jake made a cake by the lake.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to cap, then cape. The vowel changes.",
        "contrastPairs": [
          [
            "cap",
            "cape"
          ],
          [
            "mad",
            "made"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l18",
    "category": "phonics",
    "level": 18,
    "before_fields": {
      "title_en": "Silent e makes long i",
      "title_ja": "最後のeは無音で、iは/aɪ/になります。短いiのsitと比べます。",
      "content": {
        "phonicsTarget": "Silent e makes long i",
        "sound": "/aɪ/ in i_e",
        "examples": [
          "bike",
          "time",
          "five",
          "smile"
        ],
        "japaneseHint": "最後のeは無音で、iは/aɪ/になります。短いiのsitと比べます。",
        "mouthTip": "Start with an open vowel and glide toward /ɪ/. Stop on the final consonant without sounding the e.",
        "practiceWords": [
          "kite",
          "line",
          "drive",
          "white"
        ],
        "practiceSentence": "Mike rides his bike at five.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Silent e makes long i",
      "title_ja": "最後のeは無音で、iは/aɪ/になります。短いiのsitと比べます。 ここでの語に共通するパターンです。have・give・loveのような例外もあります。",
      "content": {
        "phonicsTarget": "Silent e makes long i",
        "sound": "/aɪ/ in i_e",
        "examples": [
          "bike",
          "time",
          "five",
          "smile"
        ],
        "japaneseHint": "最後のeは無音で、iは/aɪ/になります。短いiのsitと比べます。 ここでの語に共通するパターンです。have・give・loveのような例外もあります。",
        "mouthTip": "Start with an open vowel and glide toward /ɪ/. Stop on the final consonant without sounding the e.",
        "practiceWords": [
          "kite",
          "line",
          "drive",
          "white"
        ],
        "practiceSentence": "Mike rides his bike at five.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to bit, then bite. The vowel changes.",
        "contrastPairs": [
          [
            "bit",
            "bite"
          ],
          [
            "kit",
            "kite"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l19",
    "category": "phonics",
    "level": 19,
    "before_fields": {
      "title_en": "Silent e makes long o",
      "title_ja": "最後のeは読まず、oを滑らかな/oʊ/にします。hopとhopeを聞き分けます。",
      "content": {
        "phonicsTarget": "Silent e makes long o",
        "sound": "/oʊ/ in o_e",
        "examples": [
          "home",
          "note",
          "rose",
          "stone"
        ],
        "japaneseHint": "最後のeは読まず、oを滑らかな/oʊ/にします。hopとhopeを聞き分けます。",
        "mouthTip": "Begin with relaxed lips, then round them as the vowel glides. Keep the last consonant distinct.",
        "practiceWords": [
          "hope",
          "rope",
          "close",
          "phone"
        ],
        "practiceSentence": "Rose wrote a note at home.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Silent e makes long o",
      "title_ja": "最後のeは読まず、oを滑らかな/oʊ/にします。hopとhopeを聞き分けます。 ここでの語に共通するパターンです。have・give・loveのような例外もあります。",
      "content": {
        "phonicsTarget": "Silent e makes long o",
        "sound": "/oʊ/ (US), /əʊ/ (UK) in o_e",
        "examples": [
          "home",
          "note",
          "rose",
          "stone"
        ],
        "japaneseHint": "最後のeは読まず、oを滑らかな/oʊ/にします。hopとhopeを聞き分けます。 ここでの語に共通するパターンです。have・give・loveのような例外もあります。",
        "mouthTip": "Begin with relaxed lips, then round them as the vowel glides. Keep the last consonant distinct.",
        "practiceWords": [
          "hope",
          "rope",
          "bone",
          "phone"
        ],
        "practiceSentence": "Rose wrote a note at home.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to hop, then hope. The vowel changes.",
        "contrastPairs": [
          [
            "hop",
            "hope"
          ],
          [
            "not",
            "note"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l20",
    "category": "phonics",
    "level": 20,
    "before_fields": {
      "title_en": "Silent e patterns with u and e",
      "title_ja": "u_eは/juː/または/uː/、e_eは/iː/になります。最後のeは発音しません。",
      "content": {
        "phonicsTarget": "Silent e patterns with u and e",
        "sound": "/juː/ or /uː/ in u_e; /iː/ in e_e",
        "examples": [
          "cube",
          "June",
          "rule",
          "theme"
        ],
        "japaneseHint": "u_eは/juː/または/uː/、e_eは/iː/になります。最後のeは発音しません。",
        "mouthTip": "For /juː/, begin with a light y sound before rounded /uː/. For /iː/, keep the tongue high and smile slightly.",
        "practiceWords": [
          "cute",
          "tune",
          "flute",
          "these"
        ],
        "practiceSentence": "June chose a cute theme for the flute show.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Silent e patterns with u and e",
      "title_ja": "u_eは/juː/または/uː/、e_eは/iː/になります。最後のeは発音しません。 ここでの語に共通するパターンです。have・give・loveのような例外もあります。",
      "content": {
        "phonicsTarget": "Silent e patterns with u and e",
        "sound": "/juː/ or /uː/ in u_e; /iː/ in e_e",
        "examples": [
          "cube",
          "June",
          "rule",
          "theme"
        ],
        "japaneseHint": "u_eは/juː/または/uː/、e_eは/iː/になります。最後のeは発音しません。 ここでの語に共通するパターンです。have・give・loveのような例外もあります。",
        "mouthTip": "For /juː/, begin with a light y sound before rounded /uː/. For /iː/, keep the tongue high and smile slightly.",
        "practiceWords": [
          "cute",
          "tune",
          "flute",
          "these"
        ],
        "practiceSentence": "June chose these cute cubes.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to cub and cube. Then listen to these.",
        "contrastPairs": [
          [
            "cub",
            "cube"
          ],
          [
            "cut",
            "cute"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l21",
    "category": "phonics",
    "level": 21,
    "before_fields": {
      "title_en": "Long a vowel teams ai and ay",
      "title_ja": "aiは語の中、ayは語末に多く、どちらも/eɪ/を表すことが多いです。",
      "content": {
        "phonicsTarget": "Long a vowel teams ai and ay",
        "sound": "/eɪ/",
        "examples": [
          "rain",
          "train",
          "day",
          "play"
        ],
        "japaneseHint": "aiは語の中、ayは語末に多く、どちらも/eɪ/を表すことが多いです。",
        "mouthTip": "Start at a clear mid vowel and glide upward. Keep it one syllable rather than separating e and i.",
        "practiceWords": [
          "mail",
          "paint",
          "stay",
          "today"
        ],
        "practiceSentence": "We may take the train on a rainy day.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Long a vowel teams ai and ay",
      "title_ja": "aiは語の中、ayは語末に多く、どちらも/eɪ/を表すことが多いです。",
      "content": {
        "phonicsTarget": "Long a vowel teams ai and ay",
        "sound": "/eɪ/",
        "examples": [
          "rain",
          "train",
          "day",
          "play"
        ],
        "japaneseHint": "aiは語の中、ayは語末に多く、どちらも/eɪ/を表すことが多いです。",
        "mouthTip": "Start at a clear mid vowel and glide upward. Keep it one syllable rather than separating e and i.",
        "practiceWords": [
          "mail",
          "paint",
          "stay",
          "today"
        ],
        "practiceSentence": "We may take the train on a rainy day.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the same vowel in rain and day.",
        "contrastPairs": [
          [
            "paid",
            "pad"
          ],
          [
            "day",
            "die"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l22",
    "category": "phonics",
    "level": 22,
    "before_fields": {
      "title_en": "Long e vowel teams ee and ea",
      "title_ja": "eeとeaは長い/iː/になることが多いですが、headやbreadのeaは短い/e/です。",
      "content": {
        "phonicsTarget": "Long e vowel teams ee and ea",
        "sound": "/iː/",
        "examples": [
          "green",
          "sleep",
          "read",
          "team"
        ],
        "japaneseHint": "eeとeaは長い/iː/になることが多いですが、headやbreadのeaは短い/e/です。",
        "mouthTip": "Keep the tongue high and front with lightly spread lips. Hold the sound without adding a second vowel.",
        "practiceWords": [
          "feet",
          "street",
          "clean",
          "speak"
        ],
        "practiceSentence": "The team reads beneath the green tree.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Long e vowel teams ee and ea",
      "title_ja": "eeとeaは長い/iː/になることが多いですが、headやbreadのeaは短い/e/です。",
      "content": {
        "phonicsTarget": "Long e vowel teams ee and ea",
        "sound": "/iː/",
        "examples": [
          "green",
          "sleep",
          "leaf",
          "team"
        ],
        "japaneseHint": "eeとeaは長い/iː/になることが多いですが、headやbreadのeaは短い/e/です。",
        "mouthTip": "Keep the tongue high and front with lightly spread lips. Hold the sound without adding a second vowel.",
        "practiceWords": [
          "feet",
          "street",
          "clean",
          "speak"
        ],
        "practiceSentence": "The team reads beneath the green tree.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the long vowel in green and leaf.",
        "contrastPairs": [
          [
            "ship",
            "sheep"
          ],
          [
            "fit",
            "feet"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l23",
    "category": "phonics",
    "level": 23,
    "before_fields": {
      "title_en": "Long o vowel teams oa and ow",
      "title_ja": "oaは語の中、owは語末に多く、滑らかな/oʊ/になります。ただしcowのowは/aʊ/です。",
      "content": {
        "phonicsTarget": "Long o vowel teams oa and ow",
        "sound": "/oʊ/",
        "examples": [
          "boat",
          "road",
          "snow",
          "window"
        ],
        "japaneseHint": "oaは語の中、owは語末に多く、滑らかな/oʊ/になります。ただしcowのowは/aʊ/です。",
        "mouthTip": "Glide from a neutral rounded vowel to tighter lips. Do not split the vowel team into two syllables.",
        "practiceWords": [
          "coat",
          "toast",
          "grow",
          "yellow"
        ],
        "practiceSentence": "The yellow boat moves slowly down the road.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Long o vowel teams oa and ow",
      "title_ja": "oaは語の中、owは語末に多く、滑らかな/oʊ/になります。ただしcowのowは/aʊ/です。",
      "content": {
        "phonicsTarget": "Long o vowel teams oa and ow",
        "sound": "/oʊ/ (US), /əʊ/ (UK)",
        "examples": [
          "boat",
          "road",
          "snow",
          "window"
        ],
        "japaneseHint": "oaは語の中、owは語末に多く、滑らかな/oʊ/になります。ただしcowのowは/aʊ/です。",
        "mouthTip": "Glide from a neutral rounded vowel to tighter lips. Do not split the vowel team into two syllables.",
        "practiceWords": [
          "coat",
          "toast",
          "grow",
          "yellow"
        ],
        "practiceSentence": "The boat moves slowly past the yellow house.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the same vowel in boat and snow.",
        "contrastPairs": [
          [
            "coat",
            "cot"
          ],
          [
            "low",
            "law"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l24",
    "category": "phonics",
    "level": 24,
    "before_fields": {
      "title_en": "Two common sounds of oo",
      "title_ja": "moonのooは長い/uː/、bookのooは短い/ʊ/です。つづりだけでは判断できない語もあります。",
      "content": {
        "phonicsTarget": "Two common sounds of oo",
        "sound": "/uː/ and /ʊ/",
        "examples": [
          "moon",
          "food",
          "book",
          "good"
        ],
        "japaneseHint": "moonのooは長い/uː/、bookのooは短い/ʊ/です。つづりだけでは判断できない語もあります。",
        "mouthTip": "Round the lips for both. Hold /uː/ longer with a tenser tongue; keep /ʊ/ short and relaxed.",
        "practiceWords": [
          "room",
          "spoon",
          "cook",
          "foot"
        ],
        "practiceSentence": "The cook put good food in the cool room.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Two common sounds of oo",
      "title_ja": "moonのooは長い/uː/、bookのooは短い/ʊ/です。つづりだけでは判断できない語もあります。",
      "content": {
        "phonicsTarget": "Two common sounds of oo",
        "sound": "/uː/ and /ʊ/",
        "examples": [
          "moon",
          "food",
          "book",
          "good"
        ],
        "japaneseHint": "moonのooは長い/uː/、bookのooは短い/ʊ/です。つづりだけでは判断できない語もあります。",
        "mouthTip": "Round the lips for both. Hold /uː/ longer with a tenser tongue; keep /ʊ/ short and relaxed.",
        "practiceWords": [
          "pool",
          "spoon",
          "cook",
          "foot"
        ],
        "practiceSentence": "The cook put good food by the cool pool.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to fool and full. Compare the two vowels.",
        "contrastPairs": [
          [
            "fool",
            "full"
          ],
          [
            "pool",
            "pull"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l25",
    "category": "phonics",
    "level": 25,
    "before_fields": {
      "title_en": "R-controlled vowels ar and or",
      "title_ja": "US英語では母音からrへ滑らかにつなぎます。UK英語では後ろに母音がなければrを発音しないことがあります。",
      "content": {
        "phonicsTarget": "R-controlled vowels ar and or",
        "sound": "/ɑr/ and /ɔr/ in US English",
        "examples": [
          "car",
          "star",
          "fork",
          "short"
        ],
        "japaneseHint": "US英語では母音からrへ滑らかにつなぎます。UK英語では後ろに母音がなければrを発音しないことがあります。",
        "mouthTip": "For US /r/, pull the tongue slightly back without touching the roof. Avoid adding a Japanese vowel after r.",
        "practiceWords": [
          "park",
          "farm",
          "storm",
          "morning"
        ],
        "practiceSentence": "A short storm passed over the farm.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "R-controlled vowels ar and or",
      "title_ja": "US英語では母音からrへ滑らかにつなぎます。UK英語では後ろに母音がなければrを発音しないことがあります。",
      "content": {
        "phonicsTarget": "R-controlled vowels ar and or",
        "sound": "/ɑr/ and /ɔr/ in US English",
        "examples": [
          "car",
          "star",
          "fork",
          "short"
        ],
        "japaneseHint": "US英語では母音からrへ滑らかにつなぎます。UK英語では後ろに母音がなければrを発音しないことがあります。",
        "mouthTip": "For US /r/, pull the tongue slightly back without touching the roof. Avoid adding a Japanese vowel after r.",
        "practiceWords": [
          "park",
          "farm",
          "storm",
          "morning"
        ],
        "practiceSentence": "A short storm passed over the farm.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to car and core. Notice how each accent treats the ending.",
        "contrastPairs": [
          [
            "car",
            "core"
          ],
          [
            "park",
            "pork"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l26",
    "category": "phonics",
    "level": 26,
    "before_fields": {
      "title_en": "R-controlled spellings er, ir, and ur",
      "title_ja": "er・ir・urは多くの語で似た音になります。USではrを響かせ、UKでは長い中央母音になります。",
      "content": {
        "phonicsTarget": "R-controlled spellings er, ir, and ur",
        "sound": "/ɝ/ or /ɜː/",
        "examples": [
          "her",
          "bird",
          "turn",
          "first"
        ],
        "japaneseHint": "er・ir・urは多くの語で似た音になります。USではrを響かせ、UKでは長い中央母音になります。",
        "mouthTip": "Keep the lips relaxed. In US English, curl or bunch the tongue without touching the roof; in UK English, sustain the central vowel.",
        "practiceWords": [
          "term",
          "shirt",
          "nurse",
          "Thursday"
        ],
        "practiceSentence": "The first bird returned on Thursday.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "R-controlled spellings er, ir, and ur",
      "title_ja": "er・ir・urは多くの語で似た音になります。USではrを響かせ、UKでは長い中央母音になります。",
      "content": {
        "phonicsTarget": "R-controlled spellings er, ir, and ur",
        "sound": "/ɝ/ or /ɜː/",
        "examples": [
          "her",
          "bird",
          "turn",
          "first"
        ],
        "japaneseHint": "er・ir・urは多くの語で似た音になります。USではrを響かせ、UKでは長い中央母音になります。",
        "mouthTip": "Keep the lips relaxed. In US English, curl or bunch the tongue without touching the roof; in UK English, sustain the central vowel.",
        "practiceWords": [
          "term",
          "shirt",
          "nurse",
          "Thursday"
        ],
        "practiceSentence": "The first bird returned on Thursday.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the vowel in her, bird, and turn.",
        "contrastPairs": [
          [
            "bird",
            "beard"
          ],
          [
            "fur",
            "far"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l27",
    "category": "phonics",
    "level": 27,
    "before_fields": {
      "title_en": "Diphthong oi and oy",
      "title_ja": "唇を丸めた音から短い「イ」へ、1音節の中で滑らかに移動します。",
      "content": {
        "phonicsTarget": "Diphthong oi and oy",
        "sound": "/ɔɪ/",
        "examples": [
          "coin",
          "voice",
          "boy",
          "enjoy"
        ],
        "japaneseHint": "唇を丸めた音から短い「イ」へ、1音節の中で滑らかに移動します。",
        "mouthTip": "Begin with rounded lips, then relax and raise the tongue toward /ɪ/. Do not make two separate beats.",
        "practiceWords": [
          "point",
          "choice",
          "toy",
          "annoy"
        ],
        "practiceSentence": "The boy enjoyed choosing a shiny coin.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Diphthong oi and oy",
      "title_ja": "唇を丸めた音から短い「イ」へ、1音節の中で滑らかに移動します。",
      "content": {
        "phonicsTarget": "Diphthong oi and oy",
        "sound": "/ɔɪ/",
        "examples": [
          "coin",
          "voice",
          "boy",
          "enjoy"
        ],
        "japaneseHint": "唇を丸めた音から短い「イ」へ、1音節の中で滑らかに移動します。",
        "mouthTip": "Begin with rounded lips, then relax and raise the tongue toward /ɪ/. Do not make two separate beats.",
        "practiceWords": [
          "point",
          "choice",
          "toy",
          "annoy"
        ],
        "practiceSentence": "The boy enjoyed choosing a shiny coin.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the moving vowel in coin and boy.",
        "contrastPairs": [
          [
            "toy",
            "tie"
          ],
          [
            "coin",
            "cane"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l28",
    "category": "phonics",
    "level": 28,
    "before_fields": {
      "title_en": "Diphthong ou and ow",
      "title_ja": "大きく開いた音から唇を丸める方向へ移動します。snowのowは/oʊ/なので注意します。",
      "content": {
        "phonicsTarget": "Diphthong ou and ow",
        "sound": "/aʊ/",
        "examples": [
          "house",
          "cloud",
          "cow",
          "town"
        ],
        "japaneseHint": "大きく開いた音から唇を丸める方向へ移動します。snowのowは/oʊ/なので注意します。",
        "mouthTip": "Drop the jaw for the first part, then lift it while rounding the lips. Keep the glide within one syllable.",
        "practiceWords": [
          "sound",
          "round",
          "brown",
          "flower"
        ],
        "practiceSentence": "A brown cow walked around the town.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Diphthong ou and ow",
      "title_ja": "大きく開いた音から唇を丸める方向へ移動します。snowのowは/oʊ/なので注意します。",
      "content": {
        "phonicsTarget": "Diphthong ou and ow",
        "sound": "/aʊ/",
        "examples": [
          "house",
          "cloud",
          "cow",
          "town"
        ],
        "japaneseHint": "大きく開いた音から唇を丸める方向へ移動します。snowのowは/oʊ/なので注意します。",
        "mouthTip": "Drop the jaw for the first part, then lift it while rounding the lips. Keep the glide within one syllable.",
        "practiceWords": [
          "sound",
          "round",
          "brown",
          "flower"
        ],
        "practiceSentence": "A brown cow walked around the town.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the moving vowel in house and cow.",
        "contrastPairs": [
          [
            "loud",
            "load"
          ],
          [
            "now",
            "know"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l29",
    "category": "phonics",
    "level": 29,
    "before_fields": {
      "title_en": "Common spelling choices: c, k, ck, soft c, soft g, and dge",
      "title_ja": "cはe・i・yの前で/s/になりやすく、gも同じ位置で/dʒ/になることがあります。短母音の後の/k/はckが多いです。",
      "content": {
        "phonicsTarget": "Common spelling choices: c, k, ck, soft c, soft g, and dge",
        "sound": "/k/, /s/, /g/, /dʒ/",
        "examples": [
          "cat",
          "kite",
          "back",
          "city",
          "giant",
          "bridge"
        ],
        "japaneseHint": "cはe・i・yの前で/s/になりやすく、gも同じ位置で/dʒ/になることがあります。短母音の後の/k/はckが多いです。",
        "mouthTip": "Use the back of the tongue for /k/ and /g/. For /dʒ/, briefly stop the air, then release it with voice.",
        "practiceWords": [
          "coat",
          "skin",
          "clock",
          "cent",
          "gem",
          "badge"
        ],
        "practiceSentence": "The giant placed a badge beside the city clock.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Common spelling choices: c, k, ck, soft c, soft g, and dge",
      "title_ja": "cはe・i・yの前で/s/になりやすく、gも同じ位置で/dʒ/になることがあります。短母音の後の/k/はckが多いです。",
      "content": {
        "phonicsTarget": "Common spelling choices: c, k, ck, soft c, soft g, and dge",
        "sound": "/k/, /s/, /g/, /dʒ/",
        "examples": [
          "cat",
          "kite",
          "back",
          "city",
          "giant",
          "bridge"
        ],
        "japaneseHint": "cはe・i・yの前で/s/になりやすく、gも同じ位置で/dʒ/になることがあります。短母音の後の/k/はckが多いです。",
        "mouthTip": "Use the back of the tongue for /k/ and /g/. For /dʒ/, briefly stop the air, then release it with voice.",
        "practiceWords": [
          "coat",
          "skin",
          "clock",
          "cent",
          "gem",
          "badge"
        ],
        "practiceSentence": "The giant placed a badge beside the city clock.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the sounds in cat, city, giant, and bridge.",
        "contrastPairs": [
          [
            "coat",
            "goat"
          ],
          [
            "badge",
            "batch"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l30",
    "category": "phonics",
    "level": 30,
    "before_fields": {
      "title_en": "Pronouncing plural -s and past -ed endings",
      "title_ja": "語尾はつづりではなく直前の音で変わります。余分な音節を足すのは/ɪz/と/ɪd/の場合だけです。",
      "content": {
        "phonicsTarget": "Pronouncing plural -s and past -ed endings",
        "sound": "-s: /s/, /z/, /ɪz/; -ed: /t/, /d/, /ɪd/",
        "examples": [
          "cats",
          "dogs",
          "buses",
          "washed",
          "played",
          "wanted"
        ],
        "japaneseHint": "語尾はつづりではなく直前の音で変わります。余分な音節を足すのは/ɪz/と/ɪd/の場合だけです。",
        "mouthTip": "Keep voicing on for /z/ and /d/ endings. Add a full extra syllable only after sibilants for -es or after /t, d/ for -ed.",
        "practiceWords": [
          "books",
          "pens",
          "classes",
          "looked",
          "cleaned",
          "needed"
        ],
        "practiceSentence": "She washed the cups, cleaned the trays, and packed the boxes.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Pronouncing plural -s and past -ed endings",
      "title_ja": "語尾はつづりではなく直前の音で変わります。余分な音節を足すのは/ɪz/と/ɪd/の場合だけです。",
      "content": {
        "phonicsTarget": "Pronouncing plural -s and past -ed endings",
        "sound": "-s: /s/, /z/, /ɪz/; -ed: /t/, /d/, /ɪd/",
        "examples": [
          "cats",
          "dogs",
          "buses",
          "washed",
          "played",
          "wanted"
        ],
        "japaneseHint": "語尾はつづりではなく直前の音で変わります。余分な音節を足すのは/ɪz/と/ɪd/の場合だけです。",
        "mouthTip": "Keep voicing on for /z/ and /d/ endings. Add a full extra syllable only after sibilants for -es or after /t, d/ for -ed.",
        "practiceWords": [
          "books",
          "pens",
          "classes",
          "looked",
          "cleaned",
          "needed"
        ],
        "practiceSentence": "She washed the cups, cleaned the trays, and packed the boxes.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen to the endings. Some add a beat, and some do not.",
        "contrastPairs": [
          [
            "pack",
            "packed"
          ],
          [
            "need",
            "needed"
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l31",
    "category": "phonics",
    "level": 31,
    "before_fields": {
      "title_en": "Word stress, schwa, and r-colored weak vowels",
      "title_ja": "強勢のない母音は、はっきりしたア・イ・ウではなく、短く弱い/ə/になることがあります。US英語のteacherなどの語末では、rを伴う/ɚ/になることもあります。",
      "content": {
        "phonicsTarget": "Word stress, schwa, and r-colored weak vowels",
        "sound": "/ə/ in unstressed syllables; /ɚ/ in some unstressed US endings",
        "examples": [
          "about",
          "banana",
          "support",
          "teacher"
        ],
        "japaneseHint": "強勢のない母音は、はっきりしたア・イ・ウではなく、短く弱い/ə/になることがあります。US英語のteacherなどの語末では、rを伴う/ɚ/になることもあります。",
        "mouthTip": "Relax the jaw and tongue for schwa. Make the stressed syllable longer, clearer, and slightly louder. In US English, keep a light r-color in endings such as “teacher”; UK English commonly uses a non-rhotic weak vowel there.",
        "practiceWords": [
          "ago",
          "today",
          "computer",
          "family"
        ],
        "practiceSentence": "A computer can support a family project.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Word stress, schwa, and r-colored weak vowels",
      "title_ja": "強勢のない母音は、はっきりしたア・イ・ウではなく、短く弱い/ə/になることがあります。US英語のteacherなどの語末では、rを伴う/ɚ/になることもあります。",
      "content": {
        "phonicsTarget": "Word stress, schwa, and r-colored weak vowels",
        "sound": "/ə/ in unstressed syllables; /ɚ/ in some unstressed US endings",
        "examples": [
          "about",
          "banana",
          "support",
          "teacher"
        ],
        "japaneseHint": "強勢のない母音は、はっきりしたア・イ・ウではなく、短く弱い/ə/になることがあります。US英語のteacherなどの語末では、rを伴う/ɚ/になることもあります。",
        "mouthTip": "Relax the jaw and tongue for schwa. Make the stressed syllable longer, clearer, and slightly louder. In US English, keep a light r-color in endings such as “teacher”; UK English commonly uses a non-rhotic weak vowel there.",
        "practiceWords": [
          "ago",
          "today",
          "computer",
          "family"
        ],
        "practiceSentence": "A computer can support a family project.",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen for the strong beat. Keep the other syllables light.",
        "contrastPairs": [
          [
            "a present",
            "I present my work."
          ],
          [
            "a record",
            "I record my voice."
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  },
  {
    "id": "phonics-l32",
    "category": "phonics",
    "level": 32,
    "before_fields": {
      "title_en": "Sentence rhythm, linking, and reduced function words",
      "title_ja": "大切な内容語を強くし、短い機能語は弱くします。単語末の子音を次の母音へつなぐと自然なリズムになります。",
      "content": {
        "phonicsTarget": "Sentence rhythm, linking, and reduced function words",
        "sound": "stressed content words with linked, reduced grammar words",
        "examples": [
          "pick it up",
          "want to go",
          "a cup of tea",
          "meet you at eight"
        ],
        "japaneseHint": "大切な内容語を強くし、短い機能語は弱くします。単語末の子音を次の母音へつなぐと自然なリズムになります。",
        "mouthTip": "Tap a steady beat on key words. Let final consonants connect to following vowels, and reduce “to,” “a,” and “of” instead of stressing every word.",
        "practiceWords": [
          "pick it up",
          "turn it on",
          "send it over",
          "meet at eight"
        ],
        "practiceSentence": "Could you send it over when you arrive?",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby"
      },
      "icon": "🔤",
      "tags": []
    },
    "after_fields": {
      "title_en": "Sentence rhythm, linking, and reduced function words",
      "title_ja": "大切な内容語を強くし、短い機能語は弱くします。単語末の子音を次の母音へつなぐと自然なリズムになります。",
      "content": {
        "phonicsTarget": "Sentence rhythm, linking, and reduced function words",
        "sound": "stressed content words with linked, reduced grammar words",
        "examples": [
          "pick it up",
          "want to go",
          "a cup of tea",
          "meet you at eight"
        ],
        "japaneseHint": "大切な内容語を強くし、短い機能語は弱くします。単語末の子音を次の母音へつなぐと自然なリズムになります。",
        "mouthTip": "Tap a steady beat on key words. Let final consonants connect to following vowels, and reduce “to,” “a,” and “of” instead of stressing every word.",
        "practiceWords": [
          "pick it up",
          "turn it on",
          "send it over",
          "meet at eight"
        ],
        "practiceSentence": "Could you send it over when you arrive?",
        "audioUSVoice": "Ava",
        "audioUKVoice": "Libby",
        "audioFocus": "Listen for the main beats. Connect the words smoothly.",
        "contrastPairs": [
          [
            "Turn it on.",
            "Turn it off."
          ],
          [
            "Meet at eight.",
            "Meet at nine."
          ]
        ]
      },
      "icon": "",
      "tags": []
    }
  }
]$curriculum_quality$::jsonb)
  as patch(id text, category text, level smallint, before_fields jsonb, after_fields jsonb);

create temporary table review_release_027_levels on commit drop as
select * from jsonb_to_recordset($curriculum_quality$[
  {
    "category": "words",
    "level": 1,
    "before_fields": {
      "description_en": "Build useful vocabulary for classroom.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "📘"
    },
    "after_fields": {
      "description_en": "Name the things and people in your first lesson.",
      "description_ja": "最初のレッスンで使う物や人の名前を言えます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 2,
    "before_fields": {
      "description_en": "Build useful vocabulary for colors and shapes.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🔴"
    },
    "after_fields": {
      "description_en": "Describe familiar things using colours and shapes.",
      "description_ja": "身近な物を色や形で説明できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 3,
    "before_fields": {
      "description_en": "Build useful vocabulary for family and people.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "👩"
    },
    "after_fields": {
      "description_en": "Introduce family members and friends.",
      "description_ja": "家族や友達を紹介できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 4,
    "before_fields": {
      "description_en": "Build useful vocabulary for body.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🙂"
    },
    "after_fields": {
      "description_en": "Name body parts and follow simple actions.",
      "description_ja": "体の部位を言い、簡単な動作の指示が分かります。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 5,
    "before_fields": {
      "description_en": "Build useful vocabulary for food and drink.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🍚"
    },
    "after_fields": {
      "description_en": "Name everyday food and ask for a drink.",
      "description_ja": "日常の食べ物を言い、飲み物を頼めます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 6,
    "before_fields": {
      "description_en": "Build useful vocabulary for home.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🏠"
    },
    "after_fields": {
      "description_en": "Describe rooms and find things at home.",
      "description_ja": "部屋を説明し、家の中の物の場所を言えます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 7,
    "before_fields": {
      "description_en": "Build useful vocabulary for animals.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🐕"
    },
    "after_fields": {
      "description_en": "Describe animals using simple sentences.",
      "description_ja": "動物について短い文で説明できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 8,
    "before_fields": {
      "description_en": "Build useful vocabulary for basic actions.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🏃"
    },
    "after_fields": {
      "description_en": "Follow instructions and say what you can do.",
      "description_ja": "指示を理解し、自分にできる動作を言えます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 9,
    "before_fields": {
      "description_en": "Build useful vocabulary for feelings and needs.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "😊"
    },
    "after_fields": {
      "description_en": "Say how you feel and what you need.",
      "description_ja": "気持ちや必要なことを伝えられます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 10,
    "before_fields": {
      "description_en": "Build useful vocabulary for weather and nature.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "☀️"
    },
    "after_fields": {
      "description_en": "Talk about the weather and the world outside.",
      "description_ja": "天気や外の様子について話せます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 11,
    "before_fields": {
      "description_en": "Build useful vocabulary for time and routines.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🌅"
    },
    "after_fields": {
      "description_en": "Describe daily routines and when things happen.",
      "description_ja": "毎日の習慣や出来事の時を説明できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 12,
    "before_fields": {
      "description_en": "Build useful vocabulary for places in town.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🏫"
    },
    "after_fields": {
      "description_en": "Find places in town and explain where they are.",
      "description_ja": "町の施設を探し、場所を説明できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 13,
    "before_fields": {
      "description_en": "Build useful vocabulary for clothing.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "👕"
    },
    "after_fields": {
      "description_en": "Describe clothes, fit, and what to wear.",
      "description_ja": "服の特徴やサイズ、着る物について話せます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 14,
    "before_fields": {
      "description_en": "Build useful vocabulary for transport and travel.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🚗"
    },
    "after_fields": {
      "description_en": "Choose transport and talk about a journey.",
      "description_ja": "交通手段を選び、移動について話せます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 15,
    "before_fields": {
      "description_en": "Build useful vocabulary for chores and practical actions.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🧽"
    },
    "after_fields": {
      "description_en": "Explain household tasks and ask for practical help.",
      "description_ja": "家事を説明し、具体的な手助けを頼めます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 16,
    "before_fields": {
      "description_en": "Build useful vocabulary for communication.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "❓"
    },
    "after_fields": {
      "description_en": "Ask questions, explain an idea, and keep a conversation going.",
      "description_ja": "質問や説明をして、会話を続けられます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 17,
    "before_fields": {
      "description_en": "Build useful vocabulary for study skills.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "📚"
    },
    "after_fields": {
      "description_en": "Describe study habits, check meaning, and plan improvements.",
      "description_ja": "学習習慣を説明し、意味を調べ、改善点を考えられます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 18,
    "before_fields": {
      "description_en": "Build useful vocabulary for work.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🏢"
    },
    "after_fields": {
      "description_en": "Coordinate a workday and discuss a shared project.",
      "description_ja": "仕事の予定を調整し、共同の仕事について話せます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 19,
    "before_fields": {
      "description_en": "Build useful vocabulary for health.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🧑‍⚕️"
    },
    "after_fields": {
      "description_en": "Describe symptoms and arrange an appointment.",
      "description_ja": "症状を説明し、診察の予約について話せます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 20,
    "before_fields": {
      "description_en": "Build useful vocabulary for shopping and money.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🏷️"
    },
    "after_fields": {
      "description_en": "Compare prices and complete a purchase.",
      "description_ja": "値段を比較し、買い物を進められます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 21,
    "before_fields": {
      "description_en": "Build useful vocabulary for relationships.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🏘️"
    },
    "after_fields": {
      "description_en": "Discuss relationships, support, and shared responsibilities.",
      "description_ja": "人間関係や支え合い、分担について話せます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 22,
    "before_fields": {
      "description_en": "Build useful vocabulary for useful adjectives.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🟢"
    },
    "after_fields": {
      "description_en": "Choose precise descriptions for plans and behaviour.",
      "description_ja": "予定や振る舞いを適切な形容詞で説明できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 23,
    "before_fields": {
      "description_en": "Build useful vocabulary for plans and logistics.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "📍"
    },
    "after_fields": {
      "description_en": "Manage arrangements and respond to changes.",
      "description_ja": "手配を進め、予定の変更に対応できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 24,
    "before_fields": {
      "description_en": "Build useful vocabulary for technology.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "📱"
    },
    "after_fields": {
      "description_en": "Explain a technology problem and follow practical steps.",
      "description_ja": "機器の問題を説明し、操作の手順を伝えられます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 25,
    "before_fields": {
      "description_en": "Build useful vocabulary for environment.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "♻️"
    },
    "after_fields": {
      "description_en": "Discuss environmental choices and their consequences.",
      "description_ja": "環境に関する選択とその結果を話し合えます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 26,
    "before_fields": {
      "description_en": "Build useful vocabulary for nuanced emotions.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "😌"
    },
    "after_fields": {
      "description_en": "Explain nuanced feelings and respond with empathy.",
      "description_ja": "細かな感情を説明し、相手に共感できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 27,
    "before_fields": {
      "description_en": "Build useful vocabulary for critical thinking.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "⚖️"
    },
    "after_fields": {
      "description_en": "Compare evidence and explain the reasoning behind a view.",
      "description_ja": "根拠を比較し、意見の理由を説明できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 28,
    "before_fields": {
      "description_en": "Build useful vocabulary for business and projects.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "📑"
    },
    "after_fields": {
      "description_en": "Prioritise, negotiate, and improve a shared project.",
      "description_ja": "優先順位を決め、交渉し、共同の計画を改善できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 29,
    "before_fields": {
      "description_en": "Build useful vocabulary for travel details.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🧳"
    },
    "after_fields": {
      "description_en": "Handle travel changes, missing baggage, and detailed arrangements.",
      "description_ja": "旅行の変更や荷物の問題、詳しい手配に対応できます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 30,
    "before_fields": {
      "description_en": "Build useful vocabulary for high utility verbs.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🧩"
    },
    "after_fields": {
      "description_en": "Express preferences, constraints, and decisions using natural verb patterns.",
      "description_ja": "自然な動詞の形で、希望や制約、判断を伝えられます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 31,
    "before_fields": {
      "description_en": "Build useful vocabulary for precise adjectives.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "⚙️"
    },
    "after_fields": {
      "description_en": "Evaluate options precisely and express degrees of certainty.",
      "description_ja": "選択肢を的確に評価し、確信の程度を伝えられます。",
      "icon": ""
    }
  },
  {
    "category": "words",
    "level": 32,
    "before_fields": {
      "description_en": "Build useful vocabulary for advanced communication.",
      "description_ja": "単語を、音声と分かりやすい例で練習します。",
      "icon": "🔦"
    },
    "after_fields": {
      "description_en": "Clarify assumptions, resolve disagreements, and reflect on decisions.",
      "description_ja": "前提を明確にし、意見の違いを解決して判断を振り返れます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 1,
    "before_fields": {
      "description_en": "Practise “Hi, I'm Ren.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Greet someone, introduce yourself, and say thank you.",
      "description_ja": "あいさつ、自己紹介、お礼が言えます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 2,
    "before_fields": {
      "description_en": "Practise “Can I try?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Ask for help, another turn, or a repetition.",
      "description_ja": "助けや自分の順番、繰り返しを頼めます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 3,
    "before_fields": {
      "description_en": "Practise “I like this one.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Choose something and express likes politely.",
      "description_ja": "物を選び、好みを穏やかに伝えられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 4,
    "before_fields": {
      "description_en": "Practise “This is my brother.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Introduce family and use simple home routines.",
      "description_ja": "家族を紹介し、家での簡単なやり取りができます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 5,
    "before_fields": {
      "description_en": "Practise “What time is it?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Ask the time and talk about everyday routines.",
      "description_ja": "時刻を聞き、毎日の行動について話せます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 6,
    "before_fields": {
      "description_en": "Practise “Can I have some water?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Ask for food or drink and explain a preference.",
      "description_ja": "食べ物や飲み物を頼み、希望を伝えられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 7,
    "before_fields": {
      "description_en": "Practise “How much is this?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Ask about prices, colours, and trying clothes on.",
      "description_ja": "値段や色、試着について尋ねられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 8,
    "before_fields": {
      "description_en": "Practise “How do I get to the station?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Ask for directions and describe a location.",
      "description_ja": "道を尋ね、場所を説明できます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 9,
    "before_fields": {
      "description_en": "Practise “It looks like rain.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Discuss the weather and nearby plans.",
      "description_ja": "天気や近い予定について話せます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 10,
    "before_fields": {
      "description_en": "Practise “I don't feel well.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Describe how you feel and check on someone.",
      "description_ja": "体調を伝え、相手を気づかえます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 11,
    "before_fields": {
      "description_en": "Practise “Do you want to join us?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Invite a friend and talk about hobbies.",
      "description_ja": "友達を誘い、趣味について話せます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 12,
    "before_fields": {
      "description_en": "Practise “What page are we on?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Manage classroom tasks and encourage a classmate.",
      "description_ja": "授業中の困り事を伝え、クラスメートを応援できます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 13,
    "before_fields": {
      "description_en": "Practise “I've never tried that before.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Describe an experience and ask how it went.",
      "description_ja": "体験の感想を伝え、結果を尋ねられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 14,
    "before_fields": {
      "description_en": "Practise “Are you free after school?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Arrange a time and promise a later reply.",
      "description_ja": "日程を調整し、後で返事をすると伝えられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 15,
    "before_fields": {
      "description_en": "Practise “I'd like to check in.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Check in, find a seat, and ask for a local recommendation.",
      "description_ja": "チェックインや席の確認、近くのおすすめを尋ねられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 16,
    "before_fields": {
      "description_en": "Practise “Something seems to be wrong.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Explain a problem and acknowledge a possible misunderstanding.",
      "description_ja": "問題を伝え、自分が誤解した可能性を認められます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 17,
    "before_fields": {
      "description_en": "Practise “In my opinion, it's worth trying.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Give an opinion and respond to another viewpoint.",
      "description_ja": "意見を述べ、相手の見方に応じられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 18,
    "before_fields": {
      "description_en": "Practise “Why don't we start with the easiest part?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Suggest a way forward and weigh simple options.",
      "description_ja": "進め方を提案し、選択肢を検討できます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 19,
    "before_fields": {
      "description_en": "Practise “Could you say that another way?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Request clarification and check your understanding precisely.",
      "description_ja": "言い換えを頼み、理解が合っているか正確に確認できます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 20,
    "before_fields": {
      "description_en": "Practise “I'll get back to you by Friday.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Coordinate deadlines, meetings, and shared work.",
      "description_ja": "期限や会議、作業の分担を調整できます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 21,
    "before_fields": {
      "description_en": "Practise “I hope I'm not interrupting.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Show consideration, gratitude, and a thoughtful apology.",
      "description_ja": "配慮や感謝、相手を気づかう謝罪を伝えられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 22,
    "before_fields": {
      "description_en": "Practise “I'm afraid this isn't what I ordered.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Raise a service problem politely and ask for a solution.",
      "description_ja": "サービスの問題を丁寧に伝え、解決を頼めます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 23,
    "before_fields": {
      "description_en": "Practise “You won't believe what happened next.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Tell a lively story and respond empathetically.",
      "description_ja": "出来事を生き生きと話し、相手の体験に共感できます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 24,
    "before_fields": {
      "description_en": "Practise “I'm working on being more consistent.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Reflect on progress and choose a next learning goal.",
      "description_ja": "上達を振り返り、次の学習目標を考えられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 25,
    "before_fields": {
      "description_en": "Practise “I understand your point, but I see it differently.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Disagree respectfully and consider alternative explanations.",
      "description_ja": "相手を尊重して反対し、別の説明を検討できます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 26,
    "before_fields": {
      "description_en": "Practise “Let me walk you through the main idea.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Present a main idea and invite other perspectives.",
      "description_ja": "要点を説明し、別の視点を募れます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 27,
    "before_fields": {
      "description_en": "Practise “What would a fair compromise look like?” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Negotiate conditions and work towards a compromise.",
      "description_ja": "条件を交渉し、双方が受け入れられる案を探せます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 28,
    "before_fields": {
      "description_en": "Practise “I'm still getting the hang of it.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Use everyday idioms to describe progress and shared understanding.",
      "description_ja": "慣用表現で進み具合や共通の理解を伝えられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 29,
    "before_fields": {
      "description_en": "Practise “Just to keep you in the loop, the deadline has changed.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Share updates, clarify responsibility, and acknowledge concerns.",
      "description_ja": "最新情報を共有し、役割を確認して懸念を受け止められます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 30,
    "before_fields": {
      "description_en": "Practise “Looking back, I would have approached it differently.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Reflect on past choices and discuss complex outcomes.",
      "description_ja": "過去の選択を振り返り、単純には言えない結果を話せます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 31,
    "before_fields": {
      "description_en": "Practise “I can see both sides of the argument.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Qualify an opinion and recognise nuance in an argument.",
      "description_ja": "同意する範囲を示し、議論の細かな違いを捉えられます。",
      "icon": ""
    }
  },
  {
    "category": "phrases",
    "level": 32,
    "before_fields": {
      "description_en": "Practise “To put it another way, we're treating the symptom, not the cause.” and related phrases in natural conversation.",
      "description_ja": "フレーズを、音声と分かりやすい例で練習します。",
      "icon": "💬"
    },
    "after_fields": {
      "description_en": "Reframe an issue and question the assumptions behind a plan.",
      "description_ja": "問題を別の角度から説明し、計画の前提を検討できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 1,
    "before_fields": {
      "description_en": "Hear and practise first alphabet sounds: m, s, t, p.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Hear first consonants inside words and copy a short model.",
      "description_ja": "単語の最初の子音を聞き、短いお手本をまねできます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 2,
    "before_fields": {
      "description_en": "Hear and practise alphabet sounds: n, b, d, g.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Feel how the tongue and lips make voiced consonants.",
      "description_ja": "舌や唇を使う有声子音の違いを感じられます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 3,
    "before_fields": {
      "description_en": "Hear and practise breathy and voiced consonants: f, v, h, w.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Contrast breath and voice in f/v, then practise h/w.",
      "description_ja": "fとvの息・声の違いを聞き、hとwを練習できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 4,
    "before_fields": {
      "description_en": "Hear and practise remaining common alphabet sounds: c, k, j, z, y, x, q.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Distinguish l/r and recognise other common consonant spellings.",
      "description_ja": "lとrを聞き分け、ほかの基本的な子音のつづりに慣れます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 5,
    "before_fields": {
      "description_en": "Hear and practise short a in closed syllables.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Hear and form short a with an open jaw.",
      "description_ja": "口を開いて短いaの音を聞き取り、発音できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 6,
    "before_fields": {
      "description_en": "Hear and practise short i in closed syllables.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Keep short i relaxed and distinct from a long ee sound.",
      "description_ja": "力を抜いた短いiを、長いeeの音と区別できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 7,
    "before_fields": {
      "description_en": "Hear and practise short o in closed syllables.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Recognise the US and UK models of short o.",
      "description_ja": "短いoのUS・UKのお手本の違いに気づけます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 8,
    "before_fields": {
      "description_en": "Hear and practise short e in closed syllables.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Hear short e without gliding into another vowel.",
      "description_ja": "短いeを、別の母音へ滑らせずに発音できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 9,
    "before_fields": {
      "description_en": "Hear and practise short u in closed syllables.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Keep short u unrounded and clear.",
      "description_ja": "唇を丸めずに短いuを発音できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 10,
    "before_fields": {
      "description_en": "Hear and practise cVC blending and clear final consonants.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Blend a consonant, short vowel, and final consonant.",
      "description_ja": "子音・短母音・最後の子音をつなげて読めます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 11,
    "before_fields": {
      "description_en": "Hear and practise l blends at the beginning.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Join a first consonant directly to l.",
      "description_ja": "最初の子音からlへ母音を足さずにつなげられます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 12,
    "before_fields": {
      "description_en": "Hear and practise r blends at the beginning.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Join a first consonant directly to r.",
      "description_ja": "最初の子音からrへ母音を足さずにつなげられます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 13,
    "before_fields": {
      "description_en": "Hear and practise s blends and three consonant starts.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Keep s clusters together without inserting a vowel.",
      "description_ja": "sで始まる子音の連続を、母音を入れずに発音できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 14,
    "before_fields": {
      "description_en": "Hear and practise digraphs sh and ch.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Distinguish the flowing sh sound from the stopped ch sound.",
      "description_ja": "息が続くshと、息を止めて出すchを区別できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 15,
    "before_fields": {
      "description_en": "Hear and practise voiceless and voiced th.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Use tongue placement and voicing to contrast the two th sounds.",
      "description_ja": "舌の位置と声の有無で2つのthを区別できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 16,
    "before_fields": {
      "description_en": "Hear and practise digraphs wh, ph, and ng.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Connect wh, ph, and ng spellings with their sounds.",
      "description_ja": "wh・ph・ngのつづりと音を結びつけられます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 17,
    "before_fields": {
      "description_en": "Hear and practise silent e makes long a.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Contrast short a and long a in common silent e words.",
      "description_ja": "よく使うsilent eの語で短いaと長いaを区別できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 18,
    "before_fields": {
      "description_en": "Hear and practise silent e makes long i.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Contrast short i and long i in common silent e words.",
      "description_ja": "よく使うsilent eの語で短いiと長いiを区別できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 19,
    "before_fields": {
      "description_en": "Hear and practise silent e makes long o.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Contrast short o and long o in US and UK models.",
      "description_ja": "US・UKのお手本で短いoと長いoを区別できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 20,
    "before_fields": {
      "description_en": "Hear and practise silent e patterns with u and e.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Recognise u_e and e_e patterns while noticing exceptions.",
      "description_ja": "例外に注意しながらu_eとe_eの音を練習できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 21,
    "before_fields": {
      "description_en": "Hear and practise long a vowel teams ai and ay.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Recognise common ai and ay spellings for long a.",
      "description_ja": "長いaを表すaiとayの基本パターンを使えます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 22,
    "before_fields": {
      "description_en": "Hear and practise long e vowel teams ee and ea.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Recognise common ee and ea spellings for long e.",
      "description_ja": "長いeを表すeeとeaの基本パターンを使えます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 23,
    "before_fields": {
      "description_en": "Hear and practise long o vowel teams oa and ow.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Hear long o in oa/ow words and contrast different ow sounds.",
      "description_ja": "oa・owの長いoを聞き、別のowの音と区別できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 24,
    "before_fields": {
      "description_en": "Hear and practise two common sounds of oo.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Distinguish the vowel quality in moon and book.",
      "description_ja": "moonとbookの母音の質の違いを聞き分けられます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 25,
    "before_fields": {
      "description_en": "Hear and practise r controlled vowels ar and or.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Compare US and UK ar/or models without adding a vowel after r.",
      "description_ja": "rの後に母音を足さず、ar・orのUS・UKモデルを比べられます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 26,
    "before_fields": {
      "description_en": "Hear and practise r controlled spellings er, ir, and ur.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Recognise the central vowels in er/ir/ur words.",
      "description_ja": "er・ir・urの語に出る中央母音を聞き取れます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 27,
    "before_fields": {
      "description_en": "Hear and practise diphthong oi and oy.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Keep oi/oy as one smooth vowel glide.",
      "description_ja": "oi・oyを1音節の中で滑らかに発音できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 28,
    "before_fields": {
      "description_en": "Hear and practise diphthong ou and ow.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Keep ou/ow as one glide and distinguish it from long o.",
      "description_ja": "ou・owの音を一続きにし、長いoと区別できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 29,
    "before_fields": {
      "description_en": "Hear and practise common spelling choices: c, k, ck, soft c, soft g, and dge.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Choose common spellings while noticing soft c/g exceptions.",
      "description_ja": "soft c・gの例外に注意し、よく使うつづりを選べます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 30,
    "before_fields": {
      "description_en": "Hear and practise pronouncing plural s and past ed endings.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Choose -s and -ed endings by the previous sound.",
      "description_ja": "直前の音に合わせて-sと-edの語尾を発音できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 31,
    "before_fields": {
      "description_en": "Hear and practise word stress, schwa, and r colored weak vowels.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Use stress and weak vowels to make a word easier to understand.",
      "description_ja": "強勢と弱い母音を使い、単語を聞き取りやすく発音できます。",
      "icon": ""
    }
  },
  {
    "category": "phonics",
    "level": 32,
    "before_fields": {
      "description_en": "Hear and practise sentence rhythm, linking, and reduced function words.",
      "description_ja": "フォニックスを、音声と分かりやすい例で練習します。",
      "icon": "🔤"
    },
    "after_fields": {
      "description_en": "Link words and use stress to highlight meaning in a sentence.",
      "description_ja": "単語をつなぎ、文で伝えたい意味を強勢で示せます。",
      "icon": ""
    }
  }
]$curriculum_quality$::jsonb)
  as patch(category text, level smallint, before_fields jsonb, after_fields jsonb);

do $quality_guard$
declare
  conflicts text;
begin
  if (select count(*) from review_release_027_items) <> 480
    or (select count(distinct id) from review_release_027_items) <> 480
    or (select count(*) from review_release_027_levels) <> 96 then
    raise exception 'Migration 027 source is incomplete.';
  end if;

  select string_agg(conflict.id, ', ') into conflicts from (
    select patch.id from review_release_027_items patch
    left join public.review_curriculum_items actual on actual.id = patch.id
    where actual.id is null or actual.category <> patch.category or actual.level <> patch.level
      or jsonb_build_object('title_en', actual.title_en, 'title_ja', actual.title_ja,
           'content', actual.content, 'icon', actual.icon, 'tags', to_jsonb(actual.tags))
        not in (patch.before_fields, patch.after_fields)
    order by patch.id limit 12
  ) conflict;
  if conflicts is not null then
    raise exception 'Migration 027 stopped: missing, moved, or independently edited curriculum items: %. Compare with the preserved before/after manifest before proceeding.', conflicts;
  end if;

  select string_agg(conflict.id, ', ') into conflicts from (
    select patch.category || ':' || patch.level as id from review_release_027_levels patch
    left join public.review_curriculum_levels actual using (category, level)
    where actual.category is null
      or jsonb_build_object('description_en', actual.description_en, 'description_ja', actual.description_ja, 'icon', actual.icon)
        not in (patch.before_fields, patch.after_fields)
    order by patch.category, patch.level limit 12
  ) conflict;
  if conflicts is not null then
    raise exception 'Migration 027 stopped: missing or independently edited level descriptions: %.', conflicts;
  end if;
end
$quality_guard$;

update public.review_curriculum_items actual
set title_en = patch.after_fields->>'title_en',
    title_ja = patch.after_fields->>'title_ja',
    content = patch.after_fields->'content',
    icon = patch.after_fields->>'icon',
    tags = array(select jsonb_array_elements_text(patch.after_fields->'tags'))
from review_release_027_items patch
where actual.id = patch.id
  and jsonb_build_object('title_en', actual.title_en, 'title_ja', actual.title_ja,
      'content', actual.content, 'icon', actual.icon, 'tags', to_jsonb(actual.tags)) <> patch.after_fields;

update public.review_curriculum_levels actual
set description_en = patch.after_fields->>'description_en',
    description_ja = patch.after_fields->>'description_ja',
    icon = patch.after_fields->>'icon'
from review_release_027_levels patch
where actual.category = patch.category and actual.level = patch.level
  and jsonb_build_object('description_en', actual.description_en, 'description_ja', actual.description_ja, 'icon', actual.icon) <> patch.after_fields;

do $quality_postcheck$
begin
  if exists (
    select 1 from review_release_027_items patch
    left join public.review_curriculum_items actual on actual.id = patch.id
    where actual.id is null or actual.category <> patch.category or actual.level <> patch.level
      or jsonb_build_object('title_en', actual.title_en, 'title_ja', actual.title_ja,
           'content', actual.content, 'icon', actual.icon, 'tags', to_jsonb(actual.tags)) is distinct from patch.after_fields
  ) or exists (
    select 1 from review_release_027_levels patch
    left join public.review_curriculum_levels actual using (category, level)
    where actual.category is null
      or jsonb_build_object('description_en', actual.description_en, 'description_ja', actual.description_ja, 'icon', actual.icon) is distinct from patch.after_fields
  ) then
    raise exception 'Migration 027 postcheck failed; rolling back the entire transaction.';
  end if;
end
$quality_postcheck$;

commit;
