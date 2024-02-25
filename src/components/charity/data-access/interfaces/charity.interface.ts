/* tslint:disable */
/* eslint-disable */

// ######################################## THIS FILE WAS GENERATED BY MONGOOSE-TSGEN ######################################## //

// NOTE: ANY CHANGES MADE WILL BE OVERWRITTEN ON SUBSEQUENT EXECUTIONS OF MONGOOSE-TSGEN.

import mongoose from "mongoose";

/**
 * Lean version of CharityPaymentMethodBankAccountDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `CharityPaymentMethodDocument.toObject()`.
 * ```
 * const charitypaymentmethodObject = charitypaymentmethod.toObject();
 * ```
 */
export type CharityPaymentMethodBankAccount = {
  enable?: boolean;
  accNumber?: string;
  iban?: string;
  swiftCode?: string;
  bankDocs: string[];
  _id: mongoose.Types.ObjectId;
};

/**
 * Charity Docs [docs & paymentDocs]
 */
export type CharityDocs = {
  charityDocs: {
    docs1: string[];
    docs2: string[];
    docs3: string[];
    docs4: string[];
  };

    paymentMethods:{
        bankAccount:{
          accNumber?: string;
          iban?: string;
          swiftCode?: string;
          bankDocs: string[];
        } 
        fawry:{
          number?: string;
          fawryDocs: string[];
        } 
        vodafoneCash:{
          number?: string;
          vodafoneCashDocs: string[];
        }
    } 
};

/**
 * Lean version of CharityPaymentMethodFawryDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `CharityPaymentMethodDocument.toObject()`.
 * ```
 * const charitypaymentmethodObject = charitypaymentmethod.toObject();
 * ```
 */
export type CharityPaymentMethodFawry = {
  enable?: boolean;
  number?: string;
  fawryDocs: string[];
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of CharityPaymentMethodVodafoneCashDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `CharityPaymentMethodDocument.toObject()`.
 * ```
 * const charitypaymentmethodObject = charitypaymentmethod.toObject();
 * ```
 */
export type CharityPaymentMethodVodafoneCash = {
  enable?: boolean;
  number?: string;
  vodafoneCashDocs: string[];
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of CharityPaymentMethodDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `CharityDocument.toObject()`.
 * ```
 * const charityObject = charity.toObject();
 * ```
 */
export type CharityPaymentMethod = {
  bankAccount: CharityPaymentMethodBankAccount[];
  fawry: CharityPaymentMethodFawry[];
  vodafoneCash: CharityPaymentMethodVodafoneCash[];
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of CharityDonorRequestDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `CharityDocument.toObject()`.
 * ```
 * const charityObject = charity.toObject();
 * ```
 */
export type CharityDonorRequest = {
  user: user["_id"] | user;
  requestTitle: string;
  requestMessage: string;
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of CharityLocationDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `CharityDocument.toObject()`.
 * ```
 * const charityObject = charity.toObject();
 * ```
 */
export type CharityLocation = {
  governorate:
    | "Alexandria"
    | "Assiut"
    | "Aswan"
    | "Beheira"
    | "Bani Suef"
    | "Cairo"
    | "Daqahliya"
    | "Damietta"
    | "Fayyoum"
    | "Gharbiya"
    | "Giza"
    | "Helwan"
    | "Ismailia"
    | "Kafr El Sheikh"
    | "Luxor"
    | "Marsa Matrouh"
    | "Minya"
    | "Monofiya"
    | "New Valley"
    | "North Sinai"
    | "Port Said"
    | "Qalioubiya"
    | "Qena"
    | "Red Sea"
    | "Sharqiya"
    | "Sohag"
    | "South Sinai"
    | "Suez"
    | "Tanta";
  city?: string;
  street?: string;
  _id: mongoose.Types.ObjectId;
};

/**
 * Lean version of CharityDocument
 *
 * This has all Mongoose getters & functions removed. This type will be returned from `CharityDocument.toObject()`. To avoid conflicts with model names, use the type alias `CharityObject`.
 * ```
 * const charityObject = charity.toObject();
 * ```
 */
export type Charity = {
  cases: (Case["_id"] | Case)[];
  image: string;
  email: string;
  password: string;
  name: string;
  contactInfo: {
    email: string;
    phone: number;
    websiteUrl: string;
  };
  description: string;
  totalDonationsIncome?: number;
  verificationCode?: string|null;
  emailVerification: {
    isVerified?: boolean;
    verificationDate?: Date|number|null;
  };
  phoneVerification: {
    isVerified?: boolean;
    verificationDate?: Date|number|null;
  };
  isEnabled: boolean;
  isConfirmed: boolean;
  isPending: boolean;
  paymentMethods?: CharityPaymentMethod;
  rate?: number;
  donorRequests: CharityDonorRequest[];
  currency: string[];
  location: CharityLocation[];
  charityInfo: {
    registeredNumber: string;
    establishedDate: string;
  };
  charityDocs: {
    docs1: string[];
    docs2: string[];
    docs3: string[];
    docs4: string[];
  };
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Lean version of CharityDocument (type alias of `Charity`)
 *
 * Use this type alias to avoid conflicts with model names:
 * ```
 * import { Charity } from "../models"
 * import { CharityObject } from "../interfaces/mongoose.gen.ts"
 *
 * const charityObject: CharityObject = charity.toObject();
 * ```
 */
export type CharityObject = Charity;

/**
 * Mongoose Query type
 *
 * This type is returned from query functions. For most use cases, you should not need to use this type explicitly.
 */
export type CharityQuery = mongoose.Query<
  any,
  CharityDocument,
  CharityQueries
> &
  CharityQueries;

/**
 * Mongoose Query helper types
 *
 * This type represents `CharitySchema.query`. For most use cases, you should not need to use this type explicitly.
 */
export type CharityQueries = {};

export type CharityMethods = {};

export type CharityStatics = {};

/**
 * Mongoose Model type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Charity = mongoose.model<CharityDocument, CharityModel>("Charity", CharitySchema);
 * ```
 */
export type CharityModel = mongoose.Model<CharityDocument, CharityQueries> &
  CharityStatics;

/**
 * Mongoose Schema type
 *
 * Assign this type to new Charity schema instances:
 * ```
 * const CharitySchema: CharitySchema = new mongoose.Schema({ ... })
 * ```
 */
export type CharitySchema = mongoose.Schema<
  CharityDocument,
  CharityModel,
  CharityMethods,
  CharityQueries
>;

/**
 * Mongoose Subdocument type
 *
 * Type of `CharityPaymentMethodDocument["bankAccount"]` element.
 */
export type CharityPaymentMethodBankAccountDocument =
  mongoose.Types.Subdocument & {
    enable?: boolean;
    accNumber?: string;
    iban?: string;
    swiftCode?: string;
    bankDocs: mongoose.Types.Array<string>;
    _id: mongoose.Types.ObjectId;
  };

/**
 * Mongoose Subdocument type
 *
 * Type of `CharityPaymentMethodDocument["fawry"]` element.
 */
export type CharityPaymentMethodFawryDocument = mongoose.Types.Subdocument & {
  enable?: boolean;
  number?: string;
  fawryDocs: mongoose.Types.Array<string>;
  _id: mongoose.Types.ObjectId;
};

/**
 * Mongoose Subdocument type
 *
 * Type of `CharityPaymentMethodDocument["vodafoneCash"]` element.
 */
export type CharityPaymentMethodVodafoneCashDocument =
  mongoose.Types.Subdocument & {
    enable?: boolean;
    number?: string;
    vodafoneCashDocs: mongoose.Types.Array<string>;
    _id: mongoose.Types.ObjectId;
  };

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Charity = mongoose.model<CharityDocument, CharityModel>("Charity", CharitySchema);
 * ```
 */
export type CharityPaymentMethodDocument =
  mongoose.Document<mongoose.Types.ObjectId> & {
    bankAccount: mongoose.Types.DocumentArray<CharityPaymentMethodBankAccountDocument>;
    fawry: mongoose.Types.DocumentArray<CharityPaymentMethodFawryDocument>;
    vodafoneCash: mongoose.Types.DocumentArray<CharityPaymentMethodVodafoneCashDocument>;
    _id: mongoose.Types.ObjectId;
  };
  
// export type CharityPaymentMethodBankAccountDocumentArray = mongoose.Types.DocumentArray<CharityPaymentMethodBankAccountDocument>;

// export type CharityPaymentMethodFawryDocumentArray = mongoose.Types.DocumentArray<CharityPaymentMethodFawryDocument>;

// export type CharityPaymentMethodVodafoneCashDocumentArray = mongoose.Types.DocumentArray<CharityPaymentMethodVodafoneCashDocument>;

/**
 * Mongoose Subdocument type
 *
 * Type of `CharityDocument["donorRequests"]` element.
 */
export type CharityDonorRequestDocument = mongoose.Types.Subdocument & {
  user: userDocument["_id"] | userDocument;
  requestTitle: string;
  requestMessage: string;
  _id: mongoose.Types.ObjectId;
};

/**
 * Mongoose Subdocument type
 *
 * Type of `CharityDocument["location"]` element.
 */
export type CharityLocationDocument = mongoose.Types.Subdocument & {
  governorate:
    | "Alexandria"
    | "Assiut"
    | "Aswan"
    | "Beheira"
    | "Bani Suef"
    | "Cairo"
    | "Daqahliya"
    | "Damietta"
    | "Fayyoum"
    | "Gharbiya"
    | "Giza"
    | "Helwan"
    | "Ismailia"
    | "Kafr El Sheikh"
    | "Luxor"
    | "Marsa Matrouh"
    | "Minya"
    | "Monofiya"
    | "New Valley"
    | "North Sinai"
    | "Port Said"
    | "Qalioubiya"
    | "Qena"
    | "Red Sea"
    | "Sharqiya"
    | "Sohag"
    | "South Sinai"
    | "Suez"
    | "Tanta";
  city?: string;
  street?: string;
  _id: mongoose.Types.ObjectId;
};

/**
 * Mongoose Document type
 *
 * Pass this type to the Mongoose Model constructor:
 * ```
 * const Charity = mongoose.model<CharityDocument, CharityModel>("Charity", CharitySchema);
 * ```
 */
export type CharityDocument = mongoose.Document<
  mongoose.Types.ObjectId,
  CharityQueries
> &
  CharityMethods & {
    cases: mongoose.Types.Array<CaseDocument["_id"] | CaseDocument>;
    image: string;
    email: string;
    password: string;
    name: string;
    contactInfo: {
      email: string;
      phone: number;
      websiteUrl: string;
    };
    description: string;
    totalDonationsIncome?: number;
    verificationCode?: string|null;
    emailVerification: {
      isVerified?: boolean;
      verificationDate?: Date|number|null;
    };
    phoneVerification: {
      isVerified?: boolean;
      verificationDate?: Date|number|null;
    };
    isEnabled: boolean;
    isConfirmed: boolean;
    isPending: boolean;
    paymentMethods?: CharityPaymentMethodDocument;
    rate?: number;
    donorRequests: mongoose.Types.DocumentArray<CharityDonorRequestDocument>;
    currency: mongoose.Types.Array<string>;
    location: mongoose.Types.DocumentArray<CharityLocationDocument>;
    charityInfo: {
      registeredNumber: string;
      establishedDate: string;
    };
    charityDocs: {
      docs1: mongoose.Types.Array<string>;
      docs2: mongoose.Types.Array<string>;
      docs3: mongoose.Types.Array<string>;
      docs4: mongoose.Types.Array<string>;
    };
    _id: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  };

/**
 * Check if a property on a document is populated:
 * ```
 * import { IsPopulated } from "../interfaces/mongoose.gen.ts"
 *
 * if (IsPopulated<UserDocument["bestFriend"]>) { ... }
 * ```
 */
export function IsPopulated<T>(doc: T | mongoose.Types.ObjectId): doc is T {
  return doc instanceof mongoose.Document;
}

/**
 * Helper type used by `PopulatedDocument`. Returns the parent property of a string
 * representing a nested property (i.e. `friend.user` -> `friend`)
 */
type ParentProperty<T> = T extends `${infer P}.${string}` ? P : never;

/**
 * Helper type used by `PopulatedDocument`. Returns the child property of a string
 * representing a nested property (i.e. `friend.user` -> `user`).
 */
type ChildProperty<T> = T extends `${string}.${infer C}` ? C : never;

/**
 * Helper type used by `PopulatedDocument`. Removes the `ObjectId` from the general union type generated
 * for ref documents (i.e. `mongoose.Types.ObjectId | UserDocument` -> `UserDocument`)
 */
type PopulatedProperty<Root, T extends keyof Root> = Omit<Root, T> & {
  [ref in T]: Root[T] extends mongoose.Types.Array<infer U>
    ? mongoose.Types.Array<Exclude<U, mongoose.Types.ObjectId>>
    : Exclude<Root[T], mongoose.Types.ObjectId>;
};

/**
 * Populate properties on a document type:
 * ```
 * import { PopulatedDocument } from "../interfaces/mongoose.gen.ts"
 *
 * function example(user: PopulatedDocument<UserDocument, "bestFriend">) {
 *   console.log(user.bestFriend._id) // typescript knows this is populated
 * }
 * ```
 */
export type PopulatedDocument<DocType, T> = T extends keyof DocType
  ? PopulatedProperty<DocType, T>
  : ParentProperty<T> extends keyof DocType
  ? Omit<DocType, ParentProperty<T>> & {
      [ref in ParentProperty<T>]: DocType[ParentProperty<T>] extends mongoose.Types.Array<
        infer U
      >
        ? mongoose.Types.Array<
            ChildProperty<T> extends keyof U
              ? PopulatedProperty<U, ChildProperty<T>>
              : PopulatedDocument<U, ChildProperty<T>>
          >
        : ChildProperty<T> extends keyof DocType[ParentProperty<T>]
        ? PopulatedProperty<DocType[ParentProperty<T>], ChildProperty<T>>
        : PopulatedDocument<DocType[ParentProperty<T>], ChildProperty<T>>;
    }
  : DocType;

/**
 * Helper types used by the populate overloads
 */
type Unarray<T> = T extends Array<infer U> ? U : T;
type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * Augment mongoose with Query.populate overloads
 */
declare module "mongoose" {
  interface Query<ResultType, DocType, THelpers = {}> {
    populate<T extends string>(
      path: T,
      select?: string | any,
      model?: string | Model<any, THelpers>,
      match?: any
    ): Query<
      ResultType extends Array<DocType>
        ? Array<PopulatedDocument<Unarray<ResultType>, T>>
        : ResultType extends DocType
        ? PopulatedDocument<Unarray<ResultType>, T>
        : ResultType,
      DocType,
      THelpers
    > &
      THelpers;

    populate<T extends string>(
      options: Modify<PopulateOptions, { path: T }> | Array<PopulateOptions>
    ): Query<
      ResultType extends Array<DocType>
        ? Array<PopulatedDocument<Unarray<ResultType>, T>>
        : ResultType extends DocType
        ? PopulatedDocument<Unarray<ResultType>, T>
        : ResultType,
      DocType,
      THelpers
    > &
      THelpers;
  }
}
