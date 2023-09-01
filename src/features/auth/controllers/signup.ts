import {joiValidation} from "@global/decorators/joi-decoratorss";
import {signupSchema} from "@auth/schemes/signup";
import {IAuthDocument, ISignUpData} from "@auth/interfaces/auth.interface";
import {authService} from "@service/db/auth.service";
import {Request, Response} from "express";
import {BadRequestError} from "@global/helper/error-handler";
import {ObjectId} from "mongodb";
import {Helpers} from "@global/helper/helpers";
import {UploadApiResponse} from "cloudinary";
import {uploads} from "@global/helper/cloudinary-upload";
import HTTP_STATUS from "http-status-codes";

export class Signup {
    @joiValidation(signupSchema)
    public async create(req: Request, res: Response): Promise<void> {
        const {username, email, password, avatarColor, avatarImage} = req.body;

        const checkIfUserExist: IAuthDocument = await authService.getUserByUserNameOrEmail(username, email);

        if (checkIfUserExist) {
            throw new BadRequestError('Invalid credentials');
        }
        const authObjectId: ObjectId = new ObjectId();
        const userObjectId: ObjectId = new ObjectId();
        const uId = `${Helpers.generateRandomIntegers(12)}`;
        const authData: IAuthDocument = Signup.prototype.signupData({
            _id: authObjectId,
            uId,
            username,
            email,
            password,
            avatarColor
        });
        const result: UploadApiResponse = await uploads(avatarImage, `${userObjectId}`, true, true) as UploadApiResponse;
        if (!result?.public_id) {
            throw new BadRequestError('error uploading image')
        }
        res.status(HTTP_STATUS.CREATED).json({message:'User has been created', authData }, )
    }

    private signupData(data: ISignUpData): IAuthDocument {
        const {_id, username, email, uId, password, avatarColor} = data;
        return {
            _id,
            uId,
            username: Helpers.firstLetterUppercase(username),
            email: Helpers.lowerCase(email),
            password,
            avatarColor,
            createdAt: new Date(),
        } as IAuthDocument;
    }
}
