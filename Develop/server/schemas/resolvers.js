const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({
                    _id: context.user._id
                })
                .select('-password -__v')
                .populate('savedBooks');
            return userData
            }
        throw new AuthenticationError('Not logged in.');
        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if(!user) {
                throw new AuthenticationError('Wrong Credentials');
            }
            const correctPW = await user.isCorrectPassword(password);
            if(!correctPW) {
                throw new AuthenticationError('Wrong Credentials');
            }
            const token = signToken(user);
            return {token, user}
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user };
        },
        saveBook: async (parent, args, context) => {
            console.log(`this is the args ${args}`, args)
            if(!context.user) {
                throw new AuthenticationError('Must be signed in.')
            }
            console.log(`this is the context`, context.user)
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: args.bookInput }},
                { new: true,  runValidators: true}
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