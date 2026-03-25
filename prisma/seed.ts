import { PrismaClient, Role, IdeaCategory, IdeaStatus, IdeaStage, VotingPeriodStatus, EventStatus } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

// Placeholder bcrypt hash for "password123"
// In production, use: bcrypt.hash("password123", 12)
const PLACEHOLDER_HASH =
  "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj1FlUmyUQey";

async function main() {
  console.log("Seeding database...");

  // ─────────────────────────────────────────────
  // Clean up existing data (order matters for FK constraints)
  // ─────────────────────────────────────────────
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.event.deleteMany();
  await prisma.votingPeriod.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  // Delete children before parents
  await prisma.user.deleteMany({ where: { parentId: { not: null } } });
  await prisma.user.deleteMany();

  // ─────────────────────────────────────────────
  // Admin user
  // ─────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "管理者 たろう",
      email: "admin@kodomo-ai.jp",
      password: PLACEHOLDER_HASH,
      nickname: "かんりしゃ",
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  // ─────────────────────────────────────────────
  // Parent users
  // ─────────────────────────────────────────────
  const parent1 = await prisma.user.create({
    data: {
      name: "田中 花子",
      email: "hanako.tanaka@example.com",
      password: PLACEHOLDER_HASH,
      nickname: "はなこママ",
      role: Role.PARENT,
      emailVerified: new Date(),
    },
  });

  const parent2 = await prisma.user.create({
    data: {
      name: "鈴木 一郎",
      email: "ichiro.suzuki@example.com",
      password: PLACEHOLDER_HASH,
      nickname: "いちろうパパ",
      role: Role.PARENT,
      emailVerified: new Date(),
    },
  });

  const parent3 = await prisma.user.create({
    data: {
      name: "山田 美咲",
      email: "misaki.yamada@example.com",
      password: PLACEHOLDER_HASH,
      nickname: "みさきママ",
      role: Role.PARENT,
      emailVerified: new Date(),
    },
  });

  // ─────────────────────────────────────────────
  // Child users (linked to parents)
  // ─────────────────────────────────────────────
  const child1 = await prisma.user.create({
    data: {
      name: "田中 けんた",
      email: "kenta.tanaka@example.com",
      password: PLACEHOLDER_HASH,
      nickname: "けんた",
      role: Role.CHILD,
      parentId: parent1.id,
      emailVerified: new Date(),
    },
  });

  const child2 = await prisma.user.create({
    data: {
      name: "田中 さくら",
      email: "sakura.tanaka@example.com",
      password: PLACEHOLDER_HASH,
      nickname: "さくら",
      role: Role.CHILD,
      parentId: parent1.id,
      emailVerified: new Date(),
    },
  });

  const child3 = await prisma.user.create({
    data: {
      name: "鈴木 ゆうと",
      email: "yuto.suzuki@example.com",
      password: PLACEHOLDER_HASH,
      nickname: "ゆうと",
      role: Role.CHILD,
      parentId: parent2.id,
      emailVerified: new Date(),
    },
  });

  const child4 = await prisma.user.create({
    data: {
      name: "山田 はるか",
      email: "haruka.yamada@example.com",
      password: PLACEHOLDER_HASH,
      nickname: "はるか",
      role: Role.CHILD,
      parentId: parent3.id,
      emailVerified: new Date(),
    },
  });

  const child5 = await prisma.user.create({
    data: {
      name: "山田 そうた",
      email: "sota.yamada@example.com",
      password: PLACEHOLDER_HASH,
      nickname: "そうた",
      role: Role.CHILD,
      parentId: parent3.id,
      emailVerified: new Date(),
    },
  });

  // ─────────────────────────────────────────────
  // Sample ideas (15 total, all categories, varying stages)
  // ─────────────────────────────────────────────
  const ideasData = [
    {
      title: "おそうじロボットAI",
      description:
        "カメラでゴミをみつけて、じどうでひろってくれるロボット。ゴミのしゅるいをAIがはんだんして、ぶんべつもしてくれます。",
      category: IdeaCategory.LIFE,
      authorId: child1.id,
      status: IdeaStatus.PUBLISHED,
      stage: IdeaStage.FRUIT,
      voteCount: 142,
    },
    {
      title: "きゅうしょく えらびAI",
      description:
        "その日のきゅうしょくのえいようをぶんせきして、たりないえいようをおしえてくれるAI。たべものがにがてな子にも、かわりになるメニューをていあんしてくれます。",
      category: IdeaCategory.SCHOOL,
      authorId: child2.id,
      status: IdeaStatus.PUBLISHED,
      stage: IdeaStage.FLOWER,
      voteCount: 98,
    },
    {
      title: "ねむりAIコーチ",
      description:
        "まいにちのねむりのようすをかんそくして、よりよくねむるためのアドバイスをしてくれるAI。こどもでもわかるようにかわいいキャラクターがせつめいしてくれます。",
      category: IdeaCategory.HEALTH,
      authorId: child3.id,
      status: IdeaStatus.SELECTED,
      stage: IdeaStage.TREE,
      voteCount: 87,
    },
    {
      title: "ゴミぶんべつかんぺきAI",
      description:
        "しゃしんをとるだけでゴミのしゅるいをはんだんして、どのゴミばこにすてるかおしえてくれるAI。まちのかんきょうをきれいにするのにやくだてたい。",
      category: IdeaCategory.ENVIRONMENT,
      authorId: child4.id,
      status: IdeaStatus.PUBLISHED,
      stage: IdeaStage.FLOWER,
      voteCount: 76,
    },
    {
      title: "AIおともだちロボット",
      description:
        "ひとりでいるときにいっしょにあそんでくれるAIロボット。こどもの気もちをりかいして、たのしいゲームやはなしをしてくれます。",
      category: IdeaCategory.PLAY,
      authorId: child5.id,
      status: IdeaStatus.PUBLISHED,
      stage: IdeaStage.TREE,
      voteCount: 65,
    },
    {
      title: "さんすうとくいAIせんせい",
      description:
        "まちがえた問題をおぼえていて、にがてなところだけれんしゅうさせてくれるAIせんせい。ゲームかんかくでたのしくべんきょうできます。",
      category: IdeaCategory.SCHOOL,
      authorId: child1.id,
      status: IdeaStatus.PUBLISHED,
      stage: IdeaStage.SPROUT,
      voteCount: 54,
    },
    {
      title: "しょくじきろくAI",
      description:
        "たべたものをしゃしんでとるだけでカロリーやえいようをはかってくれるAI。けんこうなからだつくりをてつだってくれます。",
      category: IdeaCategory.HEALTH,
      authorId: child2.id,
      status: IdeaStatus.IN_PROGRESS,
      stage: IdeaStage.TREE,
      voteCount: 49,
    },
    {
      title: "こうえんのいきもの はっけんAI",
      description:
        "こうえんでみつけたいきもののしゃしんをとると、なまえやとくちょうをおしえてくれるAI。こどもが自然にきょうみをもつきっかけになります。",
      category: IdeaCategory.ENVIRONMENT,
      authorId: child3.id,
      status: IdeaStatus.PUBLISHED,
      stage: IdeaStage.SPROUT,
      voteCount: 43,
    },
    {
      title: "おてつだいきろくAI",
      description:
        "まいにちのおてつだいをきろくして、がんばりをほめてくれるAI。ポイントをあつめてごほうびがもらえるしくみにしたい。",
      category: IdeaCategory.LIFE,
      authorId: child4.id,
      status: IdeaStatus.PUBLISHED,
      stage: IdeaStage.SEED,
      voteCount: 38,
    },
    {
      title: "AIおはなしつくり",
      description:
        "こどもがえたキャラクターやせかいかんをもとに、AIがつづきのおはなしをつくってくれるサービス。そうぞうりょくをそだてるのにいい。",
      category: IdeaCategory.PLAY,
      authorId: child5.id,
      status: IdeaStatus.PUBLISHED,
      stage: IdeaStage.SEED,
      voteCount: 31,
    },
    {
      title: "みちあんないこどもAI",
      description:
        "こどもでもわかりやすいことばでみちをおしえてくれるAI。きけんなばしょをさけたルートをていあんして、ぶじにかえれるようにてつだってくれます。",
      category: IdeaCategory.LIFE,
      authorId: child1.id,
      status: IdeaStatus.PENDING,
      stage: IdeaStage.SEED,
      voteCount: 22,
    },
    {
      title: "えいごのはつおんAIコーチ",
      description:
        "こどもがしゃべった英語のはつおんをきいて、ただしいはつおんをやさしくおしえてくれるAI。ゲームをしながら自ぜんにえいごがうまくなります。",
      category: IdeaCategory.SCHOOL,
      authorId: child2.id,
      status: IdeaStatus.PUBLISHED,
      stage: IdeaStage.SPROUT,
      voteCount: 19,
    },
    {
      title: "うごきをみるスポーツAI",
      description:
        "ボールのなげかたやうごきをカメラでとって、うまくなるためのアドバイスをくれるAI。プロがやっているようなぶんせきをこどもでもつかえるようにしたい。",
      category: IdeaCategory.PLAY,
      authorId: child3.id,
      status: IdeaStatus.DRAFT,
      stage: IdeaStage.SEED,
      voteCount: 7,
    },
    {
      title: "はなのそだてかたAI",
      description:
        "うえきのしゃしんをとると、みずのあげかたやひりょうのタイミングをおしえてくれるAI。こどもが植物をそだてるのがたのしくなるようにしたい。",
      category: IdeaCategory.ENVIRONMENT,
      authorId: child4.id,
      status: IdeaStatus.PUBLISHED,
      stage: IdeaStage.SPROUT,
      voteCount: 15,
    },
    {
      title: "きもちをことばにするAI",
      description:
        "うまくことばにできないきもちをえやイラストでえらぶと、AIがことばにてつだってくれるアプリ。こころのけんこうをまもるのにやくだてたい。",
      category: IdeaCategory.HEALTH,
      authorId: child5.id,
      status: IdeaStatus.PENDING,
      stage: IdeaStage.SEED,
      voteCount: 11,
    },
  ];

  const ideas = await Promise.all(
    ideasData.map((data) => prisma.idea.create({ data }))
  );

  // ─────────────────────────────────────────────
  // Votes (distribute votes across users for top ideas)
  // ─────────────────────────────────────────────
  const voters = [admin, parent1, parent2, parent3, child1, child2, child3];
  const publishedIdeas = ideas.filter(
    (i) =>
      i.status === IdeaStatus.PUBLISHED ||
      i.status === IdeaStatus.SELECTED ||
      i.status === IdeaStatus.IN_PROGRESS
  );

  for (const voter of voters) {
    // Each voter votes for 3 random published ideas (that they didn't create)
    const eligible = publishedIdeas.filter((i) => i.authorId !== voter.id);
    const shuffled = eligible.sort(() => Math.random() - 0.5).slice(0, 3);
    for (const idea of shuffled) {
      await prisma.vote.upsert({
        where: { userId_ideaId: { userId: voter.id, ideaId: idea.id } },
        update: {},
        create: { userId: voter.id, ideaId: idea.id },
      });
    }
  }

  // ─────────────────────────────────────────────
  // Active voting period
  // ─────────────────────────────────────────────
  const now = new Date();
  const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  await prisma.votingPeriod.create({
    data: {
      title: "2026年 春のアイデア投票",
      startDate: now,
      endDate: twoWeeksLater,
      status: VotingPeriodStatus.ACTIVE,
    },
  });

  // ─────────────────────────────────────────────
  // Upcoming events (2 total)
  // ─────────────────────────────────────────────
  const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const twoMonthsLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  await prisma.event.create({
    data: {
      title: "こどもAI発明家 春のアイデアソン",
      description:
        "みんなでアイデアをだしあって、AIツールのきほんをがくしゅうするワークショップです。おやこでさんかできます！プロのエンジニアやAI研究者がサポートしてくれます。",
      location: "東京都渋谷区 〇〇コミュニティセンター 3F",
      eventDate: oneMonthLater,
      capacity: 50,
      registeredCount: 23,
      status: EventStatus.OPEN,
    },
  });

  await prisma.event.create({
    data: {
      title: "AIはつめいプレゼンたいかい 2026",
      description:
        "これまでにえらばれたアイデアをつくったこどもたちが、おおきなステージでプレゼンします。かんきゃくとして参加もできます！おうえんしにきてください。",
      location: "東京都港区 〇〇ホール",
      eventDate: twoMonthsLater,
      capacity: 200,
      registeredCount: 47,
      status: EventStatus.UPCOMING,
    },
  });

  // ─────────────────────────────────────────────
  // Sample notifications
  // ─────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: child1.id,
        type: "VOTE_MILESTONE",
        title: "100票とつぱ！",
        body: "あなたのアイデア「おそうじロボットAI」が100票をこえました！すごい！",
        read: false,
      },
      {
        userId: child3.id,
        type: "IDEA_SELECTED",
        title: "アイデアがえらばれました！",
        body: "「ねむりAIコーチ」がつぎのフェーズにえらばれました。おめでとう！",
        read: true,
      },
      {
        userId: child2.id,
        type: "VOTING_START",
        title: "とうひょうが始まりました",
        body: "2026年 春のアイデア投票がスタートしました。ぜひとうひょうしてください！",
        read: false,
      },
    ],
  });

  console.log("Seed completed successfully!");
  console.log(`  Users: 1 admin, 3 parents, 5 children`);
  console.log(`  Ideas: ${ideas.length}`);
  console.log(`  Voting periods: 1 active`);
  console.log(`  Events: 2 upcoming`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
