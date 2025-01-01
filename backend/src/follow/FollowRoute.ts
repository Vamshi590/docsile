import { Hono } from 'hono';
import { followUser } from './FollowUser';


const followRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  }
}>();

// Follow route
followRoute.post('/:followingId/:followerId', followUser);

export default followRoute;