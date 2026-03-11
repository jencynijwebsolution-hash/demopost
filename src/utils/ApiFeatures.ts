import { FindOptions, WhereOptions, Op } from "sequelize";

interface QueryParams {
    page?: string;
    limit?: string;
    [key: string]: any;
}

class ApiFeatures {
    private query: any;
    private queryParams: QueryParams;
    private options: FindOptions = {};

    constructor(model: any, queryParams: QueryParams) {
        this.query = model;
        this.queryParams = queryParams;
    };

    WhereClause(extraWhere: WhereOptions) {
        this.options.where = { ...(this.options.where || {}), ...extraWhere };
        return this;
    };

    paginate() {
        const page = parseInt(this.queryParams.page || "1");
        const limit = parseInt(this.queryParams.limit || "10");
        const offset = (page - 1) * limit;
        this.options.limit = limit;
        this.options.offset = offset;

        return this;
    }
    sort() {
        this.options.order = [['createdAt', 'DESC']];
        return this;
    };

    selectFields(fields?: string[]) {
        if (Array.isArray(fields) && fields.length > 0) {
            this.options.attributes = fields;
        } else {
            this.options.attributes = { exclude: [] };
        }
        return this;
    };

    excludeFields(fields?: string[]) {
        if (Array.isArray(fields) && fields.length > 0) {
            this.options.attributes = { exclude: fields };
        } else {
            this.options.attributes = { exclude: [] };
        }
        return this;
    };

    rawResult(raw: boolean = true) {
        this.options.raw = raw;
        console.log(raw);
        return this;
    };

    async exec() {
        this.options.subQuery = false;
        const [data, total] = await Promise.all([
            this.query.findAll(this.options),
            this.query.count({ where: this.options.where })
        ]);
        return {
            total_document: total,
            data,
        };
    };
};

export default ApiFeatures;