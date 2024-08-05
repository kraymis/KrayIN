import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signup`, userData);
        return response.data;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        console.log('Token:', response.data.token);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const getUserData = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get user data error:', error);
        throw error;
    }
};

export const logout = async () => {
    localStorage.removeItem('token');
    return { message: 'Logged out successfully' };
};

export const createPost = async (postData) => {
    try {
        const response = await axios.post(`${API_URL}/posts`, postData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Create post error:', error);
        throw error;
    }
};

export const getPosts = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/posts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: {
                userId,
            },
        });

        return response.data.map(post => ({
            ...post,
            userLiked: post.likes.includes(userId)
        }));
    } catch (error) {
        console.error('Get posts error:', error);
        throw error;
    }
};

export const likePost = async (postId) => {
    try {
        const response = await axios.put(`${API_URL}/posts/${postId}/like`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Like post error:', error);
        throw error;
    }
  
};

export const unlikePost = async (postId) => {
    try {
        const response = await axios.put(`${API_URL}/posts/${postId}/unlike`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Unlike post error:', error);
        throw error;
    }
};

export const addComment = async (postId, commentData) => {
  try {
      const response = await axios.post(`${API_URL}/posts/${postId}/comment`, commentData, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
      });
      return response.data;
  } catch (error) {
      console.error('Add comment error:', error);
      throw error;
  }
};



export const getFriends = async () => {
    try {
        const response = await axios.get(`${API_URL}/friends`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get friends error:', error);
        throw error;
    }
};

export const getFriendRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}/friends/requests`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Get friend requests error:', error);
        throw error;
    }
};

export const deleteFriend = async (friendId) => {
    try {
        const response = await axios.delete(`${API_URL}/friends/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            data: { friendId }  // Send friendId in the body
        });
        return response.data;
    } catch (error) {
        console.log(friendId)
        console.error('Delete friend error:', error);
        throw error;
    }
};

export const acceptFriendRequest = async (requesterId) => {
    try {
        const response = await axios.post(`${API_URL}/friends/accept`, { requesterId }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Accept friend request error:', error);
        throw error;
    }
};

export const rejectFriendRequest = async (requesterId) => {
    try {
        const response = await axios.post(`${API_URL}/friends/reject`, { requesterId }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Reject friend request error:', error);
        throw error;
    }
};


export const searchUsers = async (query) => {
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { query },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  };
  
  export const sendFriendRequest = async (recipientId) => {
    try {
      const response = await axios.post(`${API_URL}/friends/send`, { recipientId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Send friend request error:', error);
      throw error;
    }
  };