const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.finOne({
                    _id: context.user._id
                })
                .select('-__v, password')
                .populate('savedBooks');
            
            return userData
            }
        throw new AuthenticationError('Not logged in.');
        },
    },
    Mutation: {
        login: async (parent, { email, password}) => {
            const user = await User.findOne({ email });
            if(!user) {
                throw new AuthenticationError('Wrong Credentials');
            }
            const correctPW = await user.isCorrectPassword(password);
            if(!correctPW) {
                throw new AuthenticationError('Wrong Credentials');
            }
            const token = signToken(user);
            return token; 
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return token;
        },
        saveBook: async (parent, args, context) => {
            if(!context.user) {
                throw new AuthenticationError('Must be signed in.')
            }
            const updatedUser = await User.findOneAndupdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: args }},
                { new: true, runValidators: true }
            );
            return updatedUser
        },
        deleteBook: async (parent, { _id }, context) => {
            if(!context.user) {
                throw new AuthenticationError('Must be logged in.')
            }
            const updatedUser = await User.findOndAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: _id } } },
                { new: true }
            );
            if(!updatedUser) {
                throw new AuthenticationError('User not found.')
            }
            return updatedUser;
        }
    }
}

module.exports = resolvers;