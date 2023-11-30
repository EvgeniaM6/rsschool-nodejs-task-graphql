type MutationPostDtoType = {
    content: string,
    title: string,
    authorId: string,
};

export type MutationPostArgs = { dto: MutationPostDtoType };

type MutationUserDtoType = {
    name: string,
    balance: number,
};

export type MutationUserArgs = { dto: MutationUserDtoType };

type MutationProfileDtoType = {
    isMale: boolean,
    yearOfBirth: number,
    userId: string,
    memberTypeId: string,
};

export type MutationProfileArgs = { dto: MutationProfileDtoType };

export type DeleteRecordArgs = { id: string };

export type ChangePostArgs = MutationPostArgs & DeleteRecordArgs;
export type ChangeUserArgs = MutationUserArgs & DeleteRecordArgs;
export type ChangeProfileArgs = MutationProfileArgs & DeleteRecordArgs;

export type MutationSubscribe = {
    userId: string,
    authorId: string,
};
