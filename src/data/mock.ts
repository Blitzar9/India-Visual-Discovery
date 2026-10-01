/**
 * Mock data for the India Visual Discovery MVP UI shell.
 *
 * Everything here is local and static. There is no Supabase, no auth,
 * no database, no media storage, and no real messaging yet. When the
 * backend lands, these types are shaped to mirror DATA_MODEL.md so the
 * UI can be repointed without redesigning screens.
 */

export interface MockUser {
  id: string;
  username: string;
  displayName: string;
  city: string;
  bio: string;
  interests: string[];
  followers: number;
  following: number;
  /** seed for deterministic avatar / artwork colors */
  seed: string;
}

export interface MockPlace {
  id: string;
  name: string;
  city: string;
  category: string;
  blurb: string;
  postCount: number;
  seed: string;
}

export type PostKind = 'photo' | 'carousel' | 'video' | 'text';

export interface MockPost {
  id: string;
  authorId: string;
  kind: PostKind;
  title: string;
  excerpt: string;
  placeId?: string;
  tags: string[];
  interests: string[];
  likes: number;
  saves: number;
  comments: number;
  createdAt: string;
  seed: string;
}

export interface MockCollection {
  id: string;
  title: string;
  description: string;
  postCount: number;
  isPublic: boolean;
  seed: string;
}

export interface MockConversation {
  id: string;
  participantId: string;
  lastMessage: string;
  updatedAt: string;
  unread: number;
}

export interface MockMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export const ME_ID = 'u-me';

export const users: MockUser[] = [
  {
    id: ME_ID,
    username: 'aisha.wanders',
    displayName: 'Aisha Khan',
    city: 'Bengaluru',
    bio: 'Collecting slow mornings, old bookshops and filter coffee. Planning a Gokarna trip.',
    interests: ['Cafés', 'Weekend trips', 'Photography'],
    followers: 214,
    following: 186,
    seed: 'aisha',
  },
  {
    id: 'u-arjun',
    username: 'arjun.eats',
    displayName: 'Arjun Mehta',
    city: 'Mumbai',
    bio: 'Street food first, questions later.',
    interests: ['Street food', 'Cafés'],
    followers: 1893,
    following: 402,
    seed: 'arjun',
  },
  {
    id: 'u-meera',
    username: 'meera.makes',
    displayName: 'Meera Nair',
    city: 'Kochi',
    bio: 'Textile designer. Handloom obsessive.',
    interests: ['Textiles & craft', 'Photography'],
    followers: 964,
    following: 311,
    seed: 'meera',
  },
  {
    id: 'u-kabir',
    username: 'kabir.frames',
    displayName: 'Kabir Shah',
    city: 'Jaipur',
    bio: 'Architecture walks every Sunday.',
    interests: ['Architecture', 'Weekend trips'],
    followers: 1204,
    following: 289,
    seed: 'kabir',
  },
  {
    id: 'u-divya',
    username: 'divya.drapes',
    displayName: 'Divya Reddy',
    city: 'Hyderabad',
    bio: 'Sarees, thrift finds, campus fits.',
    interests: ['College fits', 'Textiles & craft'],
    followers: 743,
    following: 198,
    seed: 'divya',
  },
  {
    id: 'u-rohan',
    username: 'rohan.rides',
    displayName: 'Rohan Iyer',
    city: 'Pune',
    bio: 'Weekend escapes within 200 km.',
    interests: ['Weekend trips', 'Cafés'],
    followers: 512,
    following: 344,
    seed: 'rohan',
  },
  {
    id: 'u-sana',
    username: 'sana.stays',
    displayName: 'Sana Sheikh',
    city: 'Delhi',
    bio: 'Budget stays that don’t feel budget.',
    interests: ['Weekend trips', 'Photography'],
    followers: 1580,
    following: 276,
    seed: 'sana',
  },
];

export const places: MockPlace[] = [
  {
    id: 'p-kochi-cafe',
    name: 'Kashi Art Café',
    city: 'Kochi',
    category: 'Cafés',
    blurb: 'Gallery walls, creaky wooden floors, and the famous fish molee.',
    postCount: 48,
    seed: 'kashi',
  },
  {
    id: 'p-jaipur-stepwell',
    name: 'Panna Meena ka Kund',
    city: 'Jaipur',
    category: 'Architecture',
    blurb: 'An 8-storey stepwell tucked beside Amer — go at 8am for the light.',
    postCount: 132,
    seed: 'panna',
  },
  {
    id: 'p-mumbai-street',
    name: 'Carter Road Food Lane',
    city: 'Mumbai',
    category: 'Street food',
    blurb: 'Vada pav to shawarma in one 200-metre stretch by the sea.',
    postCount: 86,
    seed: 'carter',
  },
  {
    id: 'p-gokarna-beach',
    name: 'Kudle Beach',
    city: 'Gokarna',
    category: 'Weekend trips',
    blurb: 'Sunset shacks, drum circles, and cliffs worth the climb.',
    postCount: 214,
    seed: 'kudle',
  },
  {
    id: 'p-blr-bookshop',
    name: 'Blossom Book House',
    city: 'Bengaluru',
    category: 'Neighbourhood gems',
    blurb: 'Three floors of second-hand books on Church Street.',
    postCount: 37,
    seed: 'blossom',
  },
  {
    id: 'p-kochi-loom',
    name: 'Kuthampully Weavers',
    city: 'Thrissur',
    category: 'Textiles & craft',
    blurb: 'Watch kasavu sarees woven on wooden looms, buy from the source.',
    postCount: 29,
    seed: 'loom',
  },
];

export const posts: MockPost[] = [
  {
    id: 'post-1',
    authorId: 'u-kabir',
    kind: 'photo',
    title: 'The stepwell at 8am, before the crowds',
    excerpt:
      'Reached Panna Meena just as it opened. The geometry of the steps does all the work — you only have to show up early and stay quiet.',
    placeId: 'p-jaipur-stepwell',
    tags: ['jaipur', 'heritage', 'morninglight'],
    interests: ['Architecture', 'Photography'],
    likes: 342,
    saves: 128,
    comments: 24,
    createdAt: '2h ago',
    seed: 'stepwell',
  },
  {
    id: 'post-2',
    authorId: 'u-arjun',
    kind: 'carousel',
    title: 'Five vada pavs, ranked honestly',
    excerpt:
      'Walked the full Carter Road lane and tasted five. Number three wins on chutney alone — crispy pav, extra garlic.',
    placeId: 'p-mumbai-street',
    tags: ['streetfood', 'mumbai'],
    interests: ['Street food'],
    likes: 518,
    saves: 203,
    comments: 61,
    createdAt: '5h ago',
    seed: 'vadapav',
  },
  {
    id: 'post-3',
    authorId: 'u-meera',
    kind: 'photo',
    title: 'Kasavu, straight from the loom',
    excerpt:
      'Spent a morning with the Kuthampully weavers. A single saree takes six days. The gold border is real zari, not print.',
    placeId: 'p-kochi-loom',
    tags: ['handloom', 'kasavu', 'slowfashion'],
    interests: ['Textiles & craft'],
    likes: 289,
    saves: 176,
    comments: 33,
    createdAt: '8h ago',
    seed: 'kasavu',
  },
  {
    id: 'post-4',
    authorId: 'u-sana',
    kind: 'video',
    title: 'Kudle Beach on ₹1,800 a day',
    excerpt:
      'Shack dorm, two meals, one sunset boat ride. Full budget breakdown in the comments — Gokarna is still the cheapest coast.',
    placeId: 'p-gokarna-beach',
    tags: ['budgettravel', 'gokarna', 'beach'],
    interests: ['Weekend trips'],
    likes: 764,
    saves: 402,
    comments: 88,
    createdAt: '1d ago',
    seed: 'kudlebeach',
  },
  {
    id: 'post-5',
    authorId: 'u-divya',
    kind: 'photo',
    title: 'Thrifted silk, campus-approved',
    excerpt:
      'Found this silk skirt for ₹350 at Commercial Street. Paired with a plain tee it works for class and for dinner.',
    tags: ['thrift', 'collegefits'],
    interests: ['College fits'],
    likes: 196,
    saves: 94,
    comments: 19,
    createdAt: '1d ago',
    seed: 'thriftfit',
  },
  {
    id: 'post-6',
    authorId: 'u-rohan',
    kind: 'carousel',
    title: 'Lonavala in the rains, done right',
    excerpt:
      'Left Pune at 6am, back by 9pm. Three viewpoints, one misal pav stop, zero regrets. Route map saved to my weekend collection.',
    tags: ['monsoon', 'roadtrip'],
    interests: ['Weekend trips', 'Photography'],
    likes: 431,
    saves: 287,
    comments: 45,
    createdAt: '2d ago',
    seed: 'lonavala',
  },
  {
    id: 'post-7',
    authorId: ME_ID,
    kind: 'photo',
    title: 'My corner table at Blossom',
    excerpt:
      'Third floor, left window. Found a first-edition Ruskin Bond for ₹120. Some Saturdays are just perfect.',
    placeId: 'p-blr-bookshop',
    tags: ['books', 'bengaluru'],
    interests: ['Neighbourhood gems'],
    likes: 87,
    saves: 31,
    comments: 9,
    createdAt: '2d ago',
    seed: 'blossom',
  },
  {
    id: 'post-8',
    authorId: 'u-arjun',
    kind: 'text',
    title: 'Unpopular opinion: filter coffee > espresso',
    excerpt:
      'Fight me. A ₹30 davara tumbler at 7am beats every ₹300 latte I have had this year. Drop your best darshini below.',
    tags: ['coffee', 'hot take'],
    interests: ['Cafés'],
    likes: 623,
    saves: 88,
    comments: 142,
    createdAt: '3d ago',
    seed: 'filtercoffee',
  },
  {
    id: 'post-9',
    authorId: 'u-meera',
    kind: 'photo',
    title: 'Kashi Art Café, sketchbook edition',
    excerpt:
      'Went for the fish molee, stayed four hours drawing the regulars. The staff didn’t mind at all.',
    placeId: 'p-kochi-cafe',
    tags: ['kochi', 'sketching'],
    interests: ['Cafés'],
    likes: 274,
    saves: 119,
    comments: 27,
    createdAt: '4d ago',
    seed: 'kashiart',
  },
  {
    id: 'post-10',
    authorId: 'u-sana',
    kind: 'carousel',
    title: 'Hostels I’d actually return to',
    excerpt:
      'Five stays across three cities, ranked on sleep quality, lockers, and 6am checkout friendliness.',
    tags: ['hostels', 'solotravel'],
    interests: ['Weekend trips'],
    likes: 389,
    saves: 231,
    comments: 52,
    createdAt: '5d ago',
    seed: 'hostels',
  },
];

export const collections: MockCollection[] = [
  {
    id: 'c-goa',
    title: 'Goa, someday',
    description: 'Shacks, flea markets and one very long nap.',
    postCount: 14,
    isPublic: true,
    seed: 'goa',
  },
  {
    id: 'c-cafes',
    title: 'Cafés to try',
    description: 'Within 5 km, under ₹500 for two.',
    postCount: 23,
    isPublic: false,
    seed: 'cafes',
  },
  {
    id: 'c-fits',
    title: 'Campus fits',
    description: 'Thrift-first, iron-never.',
    postCount: 9,
    isPublic: true,
    seed: 'fits',
  },
  {
    id: 'c-weekend',
    title: 'Weekend escapes',
    description: 'Leave Saturday 6am, back Sunday night.',
    postCount: 17,
    isPublic: false,
    seed: 'weekend',
  },
];

export const interests: string[] = [
  'Cafés',
  'Weekend trips',
  'Street food',
  'Textiles & craft',
  'Architecture',
  'Photography',
  'College fits',
  'Neighbourhood gems',
];

export const conversations: MockConversation[] = [
  {
    id: 'conv-1',
    participantId: 'u-rohan',
    lastMessage: 'The 6am Lonavala route — is the ghat section safe in rain?',
    updatedAt: '10m ago',
    unread: 2,
  },
  {
    id: 'conv-2',
    participantId: 'u-divya',
    lastMessage: 'Sent you the Commercial Street thrift map!',
    updatedAt: '2h ago',
    unread: 0,
  },
  {
    id: 'conv-3',
    participantId: 'u-sana',
    lastMessage: 'That Kudle budget breakdown was gold. Saving it for December.',
    updatedAt: '1d ago',
    unread: 0,
  },
];

export const messages: MockMessage[] = [
  {
    id: 'm-1',
    conversationId: 'conv-1',
    senderId: 'u-rohan',
    text: 'Hey! Saw your Gokarna plan in your bio — are you going in December?',
    createdAt: '11:02',
  },
  {
    id: 'm-2',
    conversationId: 'conv-1',
    senderId: ME_ID,
    text: 'Thinking about it! Still deciding between Gokarna and Varkala.',
    createdAt: '11:15',
  },
  {
    id: 'm-3',
    conversationId: 'conv-1',
    senderId: 'u-rohan',
    text: 'Varkala cliffs are stunning but Gokarna is easier on the pocket. I did Kudle on ₹1,800/day.',
    createdAt: '11:18',
  },
  {
    id: 'm-4',
    conversationId: 'conv-1',
    senderId: 'u-rohan',
    text: 'The 6am Lonavala route — is the ghat section safe in rain?',
    createdAt: '11:20',
  },
  {
    id: 'm-5',
    conversationId: 'conv-2',
    senderId: ME_ID,
    text: 'That silk skirt post!! Where exactly on Commercial Street?',
    createdAt: '09:40',
  },
  {
    id: 'm-6',
    conversationId: 'conv-2',
    senderId: 'u-divya',
    text: 'Sent you the Commercial Street thrift map!',
    createdAt: '09:52',
  },
  {
    id: 'm-7',
    conversationId: 'conv-3',
    senderId: 'u-sana',
    text: 'That Kudle budget breakdown was gold. Saving it for December.',
    createdAt: 'Yesterday',
  },
];

export function getUser(id: string): MockUser {
  const user = users.find((u) => u.id === id);
  if (!user) throw new Error(`Unknown mock user: ${id}`);
  return user;
}

export function getPlace(id: string): MockPlace {
  const place = places.find((p) => p.id === id);
  if (!place) throw new Error(`Unknown mock place: ${id}`);
  return place;
}

export function getMessages(conversationId: string): MockMessage[] {
  return messages.filter((m) => m.conversationId === conversationId);
}
