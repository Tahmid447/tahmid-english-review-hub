const topic = (key, titleEn, titleJa, focusEn, focusJa, phrases, vocabulary, challenge = "Core") => Object.freeze({
  key,
  title_en: titleEn,
  title_ja: titleJa,
  description_en: focusEn,
  description_ja: focusJa,
  speaking_prompt_en: `Speak for 60–90 seconds about ${focusEn.charAt(0).toLowerCase()}${focusEn.slice(1)} Give one concrete example and explain why it matters to you.`,
  speaking_prompt_ja: `${focusJa}について60〜90秒で話してください。具体例を1つ挙げ、自分にとってなぜ大切かも説明しましょう。`,
  essay_prompt_en: `Write 100–180 words about ${focusEn.charAt(0).toLowerCase()}${focusEn.slice(1)} Give a clear reason, one supporting example and a final takeaway.`,
  essay_prompt_ja: `${focusJa}について100〜180語で書いてください。理由・具体例・最後のまとめを入れましょう。`,
  challenge,
  phrases: Object.freeze(phrases),
  vocabulary: Object.freeze(vocabulary),
});

export const PREMIUM_TOPIC_MANIFEST = Object.freeze([
  Object.freeze({ slug: "june-28", topics: Object.freeze([
    topic("cafe-order", "A café order", "カフェでの注文", "A café order you would enjoy and how you would ask politely.", "カフェで楽しみたい注文と、丁寧な頼み方", ["I’d like …, please.", "Could I have …?", "That’s all, thank you."], ["order", "recommendation", "decaf", "takeaway"]),
    topic("polite-decline", "A polite no", "丁寧な断り方", "A time you needed to decline an invitation without sounding unfriendly.", "相手を嫌な気持ちにさせず、誘いを断った経験", ["Thank you, but …", "I’m afraid I can’t.", "Maybe another time."], ["invitation", "schedule", "decline", "alternative"]),
    topic("customer-care", "Good customer service", "良い接客", "What makes service at a café or shop feel thoughtful and welcoming.", "カフェや店で、気配りのある接客だと感じること", ["How can I help?", "Would you like anything else?", "I appreciate it."], ["service", "welcoming", "attentive", "request"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "june-29", topics: Object.freeze([
    topic("misheard-message", "A message you misheard", "聞き間違えたメッセージ", "A misunderstanding caused by hearing one word or detail incorrectly.", "単語や細部の聞き間違いから生まれた誤解", ["I thought you said …", "Could you say that again?", "Now I understand."], ["misunderstanding", "detail", "clarify", "announcement"]),
    topic("surprising-news", "Surprising news", "驚いた知らせ", "News that surprised you and how you reacted when you first heard it.", "驚いた知らせと、それを初めて聞いたときの反応", ["I couldn’t believe it.", "That was unexpected.", "I heard that …"], ["reaction", "rumour", "confirmed", "unexpected"]),
    topic("finding-position", "Finding the right place", "場所を見つける", "How you would explain where a person or object is positioned.", "人や物がどこにあるかを、分かりやすく説明する方法", ["It’s next to …", "You’ll see it on your left.", "It’s directly behind …"], ["position", "opposite", "beside", "landmark"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "june-30", topics: Object.freeze([
    topic("stadium-feelings", "A memorable match", "印象に残った試合", "A sports match that changed your mood while you were watching it.", "見ている間に気持ちが変化した、印象的なスポーツの試合", ["I was excited when …", "It was frustrating because …", "In the end, …"], ["supporter", "equaliser", "frustrated", "atmosphere"]),
    topic("everyday-annoyance", "An everyday annoyance", "日常のちょっとした不満", "A small everyday problem that annoys you and a reasonable solution.", "日常で少し困ることと、現実的な解決方法", ["I’m annoyed by …", "What bothers me is …", "It would help if …"], ["noise", "habit", "solution", "considerate"]),
    topic("personal-preference", "A preference that matters", "大切にしている好み", "A choice where your personal preference is stronger than other people’s advice.", "周りの意見より、自分の好みを大切にした選択", ["I prefer … to …", "For me, … works better.", "It depends on …"], ["preference", "priority", "option", "recommendation"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-04", topics: Object.freeze([
    topic("unexpected-delay", "When plans changed", "予定が変わったとき", "An unexpected delay or problem that changed your plans.", "予想外の遅れや問題で、予定が変わった経験", ["Something came up.", "I ended up …", "Luckily, …"], ["delay", "reschedule", "unexpected", "manage"]),
    topic("helpful-stranger", "Help at the right moment", "助けてもらった瞬間", "A time someone helped you when everyday life did not go as planned.", "日常が思いどおりにいかないとき、誰かに助けてもらった経験", ["I was having trouble with …", "Someone offered to …", "It made a difference."], ["assistance", "kindness", "situation", "relieved"]),
    topic("backup-plan", "Your backup plan", "自分の予備プラン", "How you prepare a practical backup plan for work, travel or daily life.", "仕事・旅行・日常生活で、現実的な予備プランを準備する方法", ["Just in case, …", "If that happens, …", "My alternative is …"], ["backup", "prepare", "alternative", "reliable"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-05", topics: Object.freeze([
    topic("quick-reaction", "Your first reaction", "最初の反応", "A situation where your first reaction changed after you learned more.", "詳しく知るうちに、最初の反応が変わった出来事", ["At first, I thought …", "Then I realised …", "Now I feel …"], ["reaction", "impression", "realise", "perspective"]),
    topic("difficult-choice", "A difficult everyday choice", "日常の迷う選択", "A recent choice between two reasonable options and how you decided.", "どちらも悪くない2つの選択肢から、最近1つを選んだ経験", ["I wasn’t sure whether to …", "I decided on …", "The main reason was …"], ["option", "advantage", "drawback", "decision"]),
    topic("thinking-time", "Asking for time", "考える時間をもらう", "Why taking time before answering can lead to a better decision.", "返事の前に考える時間を取ると、より良い判断につながる理由", ["Let me think about it.", "I’m not ready to decide yet.", "I’ll get back to you."], ["consider", "pressure", "deadline", "response"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-06", topics: Object.freeze([
    topic("natural-conversation", "A smoother conversation", "会話をなめらかにする", "What helps an English conversation sound connected rather than word by word.", "英語の会話を単語ごとではなく、なめらかに聞こえさせる工夫", ["What do you mean?", "That makes sense.", "Go on."], ["rhythm", "connected speech", "pause", "intonation"]),
    topic("keeping-talking", "Keeping a conversation going", "会話を続けるコツ", "Questions and reactions you use to keep a friendly conversation moving.", "親しい会話を止めずに続けるための質問や反応", ["How about you?", "Really? What happened?", "That sounds …"], ["follow-up", "interest", "response", "conversation"]),
    topic("clarifying-meaning", "Checking the meaning", "意味を確認する", "A time you needed to clarify someone’s meaning before responding.", "返事をする前に、相手の意味を確認する必要があった場面", ["Do you mean …?", "So, are you saying …?", "Let me make sure I understand."], ["clarify", "intention", "assumption", "confirm"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-07", topics: Object.freeze([
    topic("thoughtful-gift", "A thoughtful gift", "気持ちのこもった贈り物", "Something you bought or brought for another person and why you chose it.", "誰かのために買ったり持っていったりした物と、それを選んだ理由", ["I bought this for …", "I brought you …", "I thought you might like it."], ["gift", "souvenir", "thoughtful", "choose"]),
    topic("helping-someone", "Doing something for someone", "人のためにしたこと", "A practical thing you did on someone’s behalf.", "誰かの代わりに、または誰かのためにした実用的なこと", ["I did it for …", "Let me take care of it.", "I was happy to help."], ["behalf", "favour", "responsibility", "support"]),
    topic("bring-or-buy", "Planning what to bring", "持ち物を考える", "How you decide what to bring and what to buy for a visit or event.", "訪問やイベントで、持参する物と買う物をどう決めるか", ["I’ll bring …", "We need to buy …", "Do you already have …?"], ["supplies", "prepare", "purchase", "occasion"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-11", topics: Object.freeze([
    topic("staying-connected", "Staying connected", "つながりを保つ", "How technology helps you stay connected with people who live far away.", "遠くに住む人とのつながりを、テクノロジーがどう支えるか", ["We keep in touch through …", "It helps us stay connected.", "We usually catch up …"], ["connection", "video call", "distance", "regularly"]),
    topic("live-experience", "Live or recorded?", "ライブか録画か", "Whether you prefer a live event or a recording and why.", "イベントはライブと録画のどちらが好きか、その理由", ["I’d rather watch it live.", "A recording is convenient because …", "The atmosphere is …"], ["broadcast", "stream", "audience", "atmosphere"]),
    topic("notice-a-change", "A change you noticed", "気づいた変化", "A small change you noticed late and what made you realise it.", "少し遅れて気づいた小さな変化と、気づくきっかけ", ["I noticed that …", "I didn’t realise until …", "Something seemed different."], ["notice", "realise", "detail", "gradual"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-12", topics: Object.freeze([
    topic("learning-progress", "Progress so far", "これまでの上達", "Something you have improved at and what helped you make progress.", "上達したことと、進歩につながった方法", ["I’ve improved …", "I haven’t mastered it yet.", "What has helped most is …"], ["progress", "practice", "achievement", "yet"]),
    topic("past-experience", "An experience you had", "これまでの経験", "A past experience that changed how you do something now.", "今の行動を変えるきっかけになった過去の経験", ["I had never … before.", "After that, I …", "It has changed …"], ["experience", "lesson", "previously", "since"]),
    topic("not-yet", "A goal not reached yet", "まだ達成していない目標", "A useful goal you have not achieved yet and your next step.", "まだ達成していない実用的な目標と、次にすること", ["I haven’t … yet.", "I’ve already started …", "My next step is …"], ["goal", "milestone", "already", "plan"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-13", topics: Object.freeze([
    topic("possible-plan", "A possible plan", "実現するかもしれない予定", "A plan that might happen and what needs to be decided first.", "実現するかもしれない予定と、先に決める必要があること", ["I might …", "There’s a chance that …", "It depends on …"], ["possibility", "arrangement", "confirm", "condition"]),
    topic("best-time", "The best time of day", "一番過ごしやすい時間帯", "Which part of the day suits you best for work, study or relaxation.", "仕事・勉強・休憩に一番合う時間帯", ["I’m most productive …", "Around midday, …", "Late at night, …"], ["morning", "midday", "evening", "productive"]),
    topic("city-moment", "A moment in the city", "街での出来事", "A small problem or discovery you experienced while moving around a city.", "街を移動しているときに経験した、小さな問題や発見", ["I had to rush back.", "I was on my way to …", "I suddenly realised …"], ["commute", "entrance", "crowded", "direction"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-18", topics: Object.freeze([
    topic("missed-obligation", "A plan you missed", "できなかった予定", "Something you were supposed to do but could not complete.", "する予定だったのに、できなかったこと", ["I was supposed to …", "I couldn’t because …", "I should have …"], ["obligation", "deadline", "explanation", "reschedule"]),
    topic("asking-for-help", "Getting the right help", "必要な助けを求める", "A situation where a helper or professional made a difficult moment easier.", "困ったときに、専門家や周りの人の助けで楽になった場面", ["Could you help me with …?", "I need someone who can …", "Thank you for stepping in."], ["assistant", "emergency service", "support", "responsibility"]),
    topic("fire-safety", "Responding safely", "安全に対応する", "What people should do first if they notice a fire or another emergency.", "火災などの緊急事態に気づいたとき、最初にすべきこと", ["The building is on fire.", "We need to leave now.", "Call the fire department."], ["evacuate", "alarm", "emergency exit", "firefighter"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-19", topics: Object.freeze([
    topic("either-plan", "Two workable plans", "どちらでもよい予定", "Two plans that would both work and how you would respond clearly.", "どちらでも問題ない2つの予定と、分かりやすい返答", ["Either one works for me.", "Both options are fine.", "I’m available on …"], ["either", "both", "option", "available"]),
    topic("strong-preference", "What you would rather do", "どちらかを選ぶなら", "A choice where you would clearly rather do one thing than the other.", "2つの選択肢のうち、はっきり一方を選びたい場面", ["I would rather …", "I’d prefer to …", "The reason is …"], ["rather", "preference", "convenient", "priority"]),
    topic("neither-option", "When neither works", "どちらも合わないとき", "How to respond politely when neither of two suggestions works for you.", "2つの提案がどちらも合わないときの、丁寧な返し方", ["Neither option works for me.", "Could we consider …?", "Would another day be possible?"], ["neither", "alternative", "conflict", "suggestion"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-22", topics: Object.freeze([
    topic("meeting-time", "Finding a meeting time", "会う時間を決める", "How you would arrange a meeting time that works for everyone.", "全員に都合のよい会議時間を決める方法", ["Would you be available …?", "That time works for me.", "Could we move it to …?"], ["availability", "appointment", "schedule", "reschedule"]),
    topic("clear-answer", "A clear yes or no", "分かりやすいYes・No", "Why clear answers matter when someone asks a negative question.", "否定疑問文を聞かれたとき、明確に答えることが大切な理由", ["Yes, I am.", "No, I’m not.", "To be clear, …"], ["negative question", "confirm", "confusion", "direct"]),
    topic("flexible-choice", "Being flexible", "柔軟に選ぶ", "A situation where either of two choices is genuinely fine for you.", "2つの選択肢のどちらでも本当に問題ない場面", ["Either is fine.", "I don’t mind which one.", "Whatever works best for you."], ["flexible", "preference", "arrangement", "convenient"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-23", topics: Object.freeze([
    topic("under-weather", "Feeling under the weather", "少し体調が悪いとき", "How you change your plans when you feel slightly unwell.", "少し体調が悪いときに、予定をどう変更するか", ["I’m feeling under the weather.", "I might need to rest.", "Can we do it another day?"], ["symptom", "rest", "recover", "postpone"]),
    topic("future-invention", "A useful future invention", "未来の便利な発明", "A Doraemon-style gadget that would solve a real everyday problem.", "日常の困りごとを解決する、ドラえもんの道具のような発明", ["It would allow people to …", "I haven’t thought of a name yet.", "It could be useful when …"], ["gadget", "invention", "convenient", "imagine"]),
    topic("movement-habit", "An everyday movement habit", "日常の動作習慣", "A healthy movement or exercise habit you have started or want to start.", "始めた、または始めたい健康的な運動習慣", ["I’ve started …", "I haven’t done it regularly yet.", "It helps me …"], ["routine", "stretch", "movement", "regularly"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-25", topics: Object.freeze([
    topic("changing-feeling", "A feeling that changed", "変化した気持ち", "How your feeling gradually changed during an event or experience.", "出来事や経験の中で、気持ちが少しずつ変わったこと", ["I was getting …", "At first, I felt …", "By the end, …"], ["gradually", "emotion", "nervous", "relieved"]),
    topic("gut-decision", "Following your intuition", "直感を信じた判断", "A decision where you trusted, or chose not to trust, a gut feeling.", "直感を信じた、または信じなかった判断", ["I had a gut feeling that …", "Something didn’t feel right.", "I decided to trust …"], ["intuition", "instinct", "risk", "decision"]),
    topic("body-signal", "Listening to body signals", "体のサインに気づく", "How signals such as hunger or tiredness affect your choices.", "空腹や疲れなどの体のサインが、選択にどう影響するか", ["I’m getting hungry.", "I’m starting to feel tired.", "I should probably …"], ["appetite", "energy", "signal", "well-being"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-26", topics: Object.freeze([
    topic("realistic-hope", "A realistic hope", "実現できそうな希望", "Something you hope will happen and the action you can take toward it.", "実現してほしいことと、そのために自分ができる行動", ["I hope I can …", "I’m working toward …", "There’s a good chance …"], ["hope", "opportunity", "effort", "realistic"]),
    topic("present-wish", "A wish about now", "今についての願い", "Something you wish were different in your present situation.", "今の状況で、違っていたらよいと思うこと", ["I wish I were …", "If only I had …", "Right now, …"], ["wish", "situation", "impossible", "change"]),
    topic("past-regret", "Learning from a regret", "過去の後悔から学ぶ", "A past choice you wish you had handled differently and what you learned.", "違う対応をすればよかったと思う過去の選択と、そこから学んだこと", ["I wish I had …", "I should have …", "Since then, I’ve …"], ["regret", "consequence", "lesson", "reflect"], "Stretch"),
  ]) }),
  Object.freeze({ slug: "july-27", topics: Object.freeze([
    topic("small-accident", "A small accident", "小さなアクシデント", "A small spill, splash or mistake and how you dealt with it.", "こぼす・水がかかるなどの小さな失敗と、その後の対応", ["I accidentally spilled …", "It splashed onto …", "I cleaned it up by …"], ["spill", "pour", "splash", "accidentally"]),
    topic("acquired-taste", "An acquired taste", "だんだん好きになったもの", "A food, drink or activity you learned to enjoy gradually.", "少しずつ好きになった食べ物・飲み物・活動", ["It is an acquired taste.", "I didn’t like it at first.", "Now I appreciate …"], ["flavour", "bitter", "gradually", "appreciate"]),
    topic("tense-story", "Telling the full story", "時制を使い分ける物語", "A short story that clearly connects what happened before, during and afterward.", "出来事の前・最中・その後を、時制を分けて伝える短い話", ["Before that, I had …", "While I was …", "Since then, I have …"], ["sequence", "background", "result", "timeline"], "Stretch"),
  ]) }),
]);

export function validatePremiumTopicManifest(manifest = PREMIUM_TOPIC_MANIFEST) {
  if (manifest.length !== 17) throw new Error(`Expected 17 lesson topic sets, found ${manifest.length}.`);
  const slugs = new Set();
  manifest.forEach((lesson) => {
    if (slugs.has(lesson.slug)) throw new Error(`Duplicate lesson topic set: ${lesson.slug}`);
    slugs.add(lesson.slug);
    if (lesson.topics.length < 2 || lesson.topics.length > 3) throw new Error(`${lesson.slug} must have 2–3 topics.`);
    const keys = new Set();
    lesson.topics.forEach((entry) => {
      if (keys.has(entry.key)) throw new Error(`${lesson.slug} has duplicate topic key ${entry.key}.`);
      keys.add(entry.key);
      if (entry.phrases.length < 3 || entry.phrases.length > 6) throw new Error(`${lesson.slug}/${entry.key} needs 3–6 phrases.`);
      if (entry.vocabulary.length < 3 || entry.vocabulary.length > 8) throw new Error(`${lesson.slug}/${entry.key} needs 3–8 vocabulary items.`);
      for (const field of ["title_en", "title_ja", "description_en", "description_ja", "speaking_prompt_en", "speaking_prompt_ja", "essay_prompt_en", "essay_prompt_ja"]) {
        if (!String(entry[field] || "").trim()) throw new Error(`${lesson.slug}/${entry.key} is missing ${field}.`);
      }
    });
  });
  return true;
}
