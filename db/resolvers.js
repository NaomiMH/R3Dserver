const User = require('../models/User');
const Client = require('../models/Client');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const newToken = (user, clave, expiresIn) => {
    const {id,username} = user;
    return jwt.sign({id,username},clave,{expiresIn})
}

// Resolvers
const resolvers = {
    Query: {
        getUser: async (_, {  }, ctx ) => {
            return ctx.user;
        },
        getClientsofSeller: async (_, {}, ctx) => {
            const client = await Client.find({seller: ctx.user.id.toString()});
            return client;
        },
        getClient: async (_, { id }, ctx) => {
            // Comprobar existencia de cliente
            const isClient = await Client.findById(id);
            if (!isClient) {
                throw new Error('Cliente no registrado.');
            }
            // Comprobar permiso de usuario
            if (isClient.seller.toString() !== ctx.user.id) {
                throw new Error('Usuario no tiene permiso para editar el cliente.');
            }

            return isClient;
        }
    },
    Mutation: {
        newUser: async (_, { input } ) => {
            const { username, password } = input;
            // Comprobar que no este registrado
            const isUser = await User.findOne({username});
            if (isUser) {
                throw new Error('Usuario no disponible.');
            }
            // Encriptar password
            const salt = bcryptjs.genSaltSync(10);
            input.password = bcryptjs.hashSync(password,salt);

            // Guardar registro
            try {
                const user = new User(input);
                user.save();
                return user;
            } catch (error) {
                console.log(error);
            }
        },
        checkUser: async (_, { input } ) => {
            const { username, password } = input;
            // Comprobar que exista el usuario
            const isUser = await User.findOne({username});
            if (!isUser) {
                throw new Error('Usuario no existe.');
            }
            // Comprobar password
            const isPassword = await bcryptjs.compare(password,isUser.password);
            if (!isPassword) {
                throw new Error('Contraseña incorrecta');
            }
            // Regresar token
            return {
                token: newToken(isUser, process.env.CLAVE,'24h')
            };
        },
        newClient: async (_, { input }, ctx ) => {
            // Comprobar que no exista el cliente
            const isClient = await Client.findOne(input);
            if (isClient) {
                throw new Error('Cliente repetido.');
            }
            // Asignar vendedor
            const client = new Client(input);
            client.seller = ctx.user.id;
            // Guardar registro
            try {
                client.save();
                return client;
            } catch (error) {
                console.log(error);
            }
        },
        setClient: async (_, { id,input }, ctx ) => {
            // Comprobar que exista el cliente
            let isClient = await Client.findById(id);
            if (!isClient) {
                throw new Error('Cliente no existe.');
            }
            // Comprobar que tenga permiso el usuario
            if (isClient.seller.toString() !== ctx.user.id) {
                throw new Error('Usuario no tiene permiso para editar el cliente.');
            }
            // Guardar cambio
            client = await Client.findOneAndUpdate({_id: id}, input, {new: true});
            return client;
        },
        delClient: async (_, { id }, ctx) => {
            // Comprobar que exista el cliente
            let isClient = await Client.findById(id);
            if (!isClient) {
                throw new Error('Cliente no existe.');
            }
            // Comprobar que tenga permiso el usuario
            if (isClient.seller.toString() !== ctx.user.id) {
                throw new Error('Usuario no tiene permiso para eliminar el cliente.');
            }
            // Eliminar registro
            await Client.findOneAndDelete({_id: id});
            return "Eliminado."
        }
    }
}

module.exports = resolvers;