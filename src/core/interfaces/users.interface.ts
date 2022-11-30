interface IUser {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
}

export default IUser;