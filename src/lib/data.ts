import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  profilePictureUrl: string;
  profilePictureHint: string;
  jobTitle: string;
  education: string;
  location: string;
}

const getImage = (id: string): ImagePlaceholder => {
    const image = PlaceHolderImages.find(img => img.id === id);
    if (!image) {
        return {
            id: 'default',
            description: 'default image',
            imageUrl: 'https://picsum.photos/seed/default/400/400',
            imageHint: 'person'
        }
    }
    return image;
}

export const currentUser: User = {
  id: 'currentUser',
  name: 'Alex',
  age: 28,
  bio: 'Software engineer by day, aspiring chef by night. Love exploring new hiking trails on weekends. My dog, Rusty, is my best friend. Looking for someone to share adventures and good food with. I also play the guitar, mostly blues and rock.',
  interests: ['Hiking', 'Cooking', 'Dogs', 'Live Music', 'Technology'],
  profilePictureUrl: getImage('currentUser').imageUrl,
  profilePictureHint: getImage('currentUser').imageHint,
  jobTitle: 'Software Engineer',
  education: 'B.S. in Computer Science',
  location: 'San Francisco, CA'
};

export const matches: User[] = [
  {
    id: 'user1',
    name: 'Jessica',
    age: 26,
    bio: 'Graphic designer who loves all things creative. When I\'m not working, you can find me at a local coffee shop sketching, visiting art museums, or trying out a new recipe. Big fan of indie movies and board games.',
    interests: ['Art', 'Coffee', 'Baking', 'Movies', 'Board Games'],
    profilePictureUrl: getImage('user1').imageUrl,
    profilePictureHint: getImage('user1').imageHint,
    jobTitle: 'Graphic Designer',
    education: 'B.F.A. in Graphic Design',
    location: 'Brooklyn, NY'
  },
  {
    id: 'user2',
    name: 'Mike',
    age: 30,
    bio: 'Fitness enthusiast and outdoor adventurer. I love challenging myself, whether it\'s climbing a mountain or running a marathon. Looking for a partner who is active and doesn\'t mind getting a little muddy.',
    interests: ['Fitness', 'Climbing', 'Hiking', 'Running', 'Travel'],
    profilePictureUrl: getImage('user2').imageUrl,
    profilePictureHint: getImage('user2').imageHint,
    jobTitle: 'Personal Trainer',
    education: 'Certified Personal Trainer',
    location: 'Denver, CO'
  },
  {
    id: 'user3',
    name: 'Samantha',
    age: 29,
    bio: 'Bookworm and travel addict. My goal is to visit every continent. I enjoy deep conversations over a glass of wine and getting lost in a new city. Tell me about the best book you\'ve read recently.',
    interests: ['Reading', 'Travel', 'Wine', 'Photography', 'History'],
    profilePictureUrl: getImage('user3').imageUrl,
    profilePictureHint: getImage('user3').imageHint,
    jobTitle: 'Librarian',
    education: 'M.L.I.S.',
    location: 'Chicago, IL'
  },
  {
    id: 'user4',
    name: 'Chris',
    age: 27,
    bio: 'Veterinarian with a passion for animals. My life revolves around my job and my two rescue dogs. I\'m a homebody who enjoys a quiet night in with a good movie. I also volunteer at the local animal shelter.',
    interests: ['Animals', 'Dogs', 'Movies', 'Volunteering', 'Gardening'],
    profilePictureUrl: getImage('user4').imageUrl,
    profilePictureHint: getImage('user4').imageHint,
    jobTitle: 'Veterinarian',
    education: 'D.V.M.',
    location: 'Austin, TX'
  },
  {
    id: 'user5',
    name: 'Emily',
    age: 32,
    bio: 'Musician and music teacher. I play the piano and sing. I love going to concerts, from classical to jazz. Looking for someone who appreciates music and can hold a tune (just kidding... mostly).',
    interests: ['Music', 'Piano', 'Concerts', 'Teaching', 'Jazz'],
    profilePictureUrl: getImage('user5').imageUrl,
    profilePictureHint: getImage('user5').imageHint,
    jobTitle: 'Music Teacher',
    education: 'B.A. in Music Education',
    location: 'Nashville, TN'
  },
  {
    id: 'user6',
    name: 'David',
    age: 28,
    bio: 'Architect with a love for design and old buildings. I spend my weekends exploring the city, trying new restaurants, and taking photos. I\'m a bit of a foodie and a coffee snob.',
    interests: ['Architecture', 'Foodie', 'Photography', 'City Exploration', 'Design'],
    profilePictureUrl: getImage('user6').imageUrl,
    profilePictureHint: getImage('user6').imageHint,
    jobTitle: 'Architect',
    education: 'M.Arch',
    location: 'Boston, MA'
  },
];
