"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../helpers"));
const locals_1 = __importDefault(require("../../../providers/locals"));
const commons_1 = __importDefault(require("../../commons"));
const mutations_1 = __importDefault(require("../graphql/mutations"));
function randomName(fileName) {
    const extension = fileName.split(".").pop();
    const newFilename = (+new Date()).toString(36) + "." + extension;
    return newFilename;
}
class Upload {
    static handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { is_public } = req.body;
            const client = helpers_1.default.minioClient();
            // Get the file from the request
            const file = req.file;
            // Use the minioClient to upload the file to Minio
            const fileName = randomName(file.originalname);
            client.putObject(locals_1.default.config().minioConfig.buckets[is_public === "true" ? "public" : "private"], fileName, file.buffer, function (err, etag) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        // Handle the error
                        return res.status(500).send(err);
                    }
                    const { data, errors } = yield commons_1.default.GQLRequest({
                        variables: {
                            name: fileName,
                            original_name: file.originalname,
                            size: file.size,
                            mime_type: file.mimetype,
                            etag: etag.etag,
                            path: fileName,
                            is_public: is_public || false,
                        },
                        query: mutations_1.default.InsertFile,
                    });
                    if (!data || !data.data || !data.data.insert_files_one) {
                        const error = errors ||
                            (data.errors && data.errors[0].message) ||
                            "Something went wrong!";
                        return commons_1.default.Response(res, false, error, null);
                    }
                    return res.send(data.data.insert_files_one);
                });
            });
        });
    }
}
exports.default = Upload;
