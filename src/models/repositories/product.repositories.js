"use strict"

const {products, clothes,electronics, furnitures} = require(`../products.model`);
const {ConflictErrorResponse} = require(`../../response/error.response`);
const {getFields} = require(`../../ultils/index`);

const findAllProductsWithQuery = async ({query, limit, skip}) => {
    const result = await products.find(query)
    .populate('product_shop', "name -_id")
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
    
    return result;
}

const publishAProduct = async ({product_id, product_shop}) => {
    const holderProduct = await products.findOneAndUpdate({
        product_shop: product_shop,
        _id: product_id,
        isDraft: false,
    });

    if (!holderProduct) {
        throw new ConflictErrorResponse({message: `Error: fail to find product`});
    }

    holderProduct.isDraft = false;
    holderProduct.isPublish = true;
    let result = 1;

    try {
        await holderProduct.save();
    } catch (error) {
        result = 0;
    }

    return result;
}

const draftAProduct = async ({product_id, product_shop}) => {
    const holderProduct = await products.findOneAndUpdate({
        product_shop: product_shop,
        _id: product_id,
        isPublish: true,
    });

    if (!holderProduct) {
        throw new ConflictErrorResponse({message: `Error: fail to find product`});
    }

    holderProduct.isDraft = true;
    holderProduct.isPublish = false;

    let result = 1;

    try {
        await holderProduct.save();
    } catch (error) {
        result = 0;
    }

    return result;
}

const findProductByUser = async ({keySearch}) => {
    const textRegexp = new RegExp(keySearch);
    const  result = await products.find({
        $text: {
            $search: textRegexp,
        },
        isPublish: true,
    }, {
        score: {
            $meta: "textScore",
        },
    })
    .sort({
        score: {
            $meta: "textScore",
        },
    })
    .lean()
    .exec();

    return result;
}

const findAllProducts = async ({limit = 50, page = 1, sort = 'ctime', select}) => {
    const skip = page - 1;
    const sortBy = sort === 'ctime' ? {createdAt: -1} : {createdAt: 1};
    const result = await products.find({
        isPublish: true,
    })
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .select(getFields(select))
    .lean()
    .exec();

    return result;
}

const findProduct = async ({product_id, select}) => {
    const result = await products.findOne({
        _id: product_id,
        isPublish: true, 
    })
    .select(getFields(select))
    .lean()
    .exec();

    return result;
}

const updateProduct = async ({filter, updateData}) => {
    const result = await products.findOneAndUpdate(filter, updateData, {new: true})
    .catch(error => {
        throw new ConflictErrorResponse({message: `Error: fail to update product`});
    });
    return result;
}

const updateClothes = async ({filter, updateData}) => {
    const result = await clothes.findOneAndUpdate(filter, updateData, {new: true})
    .catch(error => {
        throw new ConflictErrorResponse({message: `Error: fail to update product`});
    });
    return result;
}

const updateElectronics = async ({filter, updateData}) => {
    const result = await electronics.findOneAndUpdate(filter, updateData, {new: true})
    .catch(error => {
        throw new ConflictErrorResponse({message: `Error: fail to update product`});
    });
    return result;
}

const updateFurnitures = async ({filter, updateData}) => {
    const result = await furnitures.findOneAndUpdate(filter, updateData, {new: true})
    .catch(error => {
        throw new ConflictErrorResponse({message: `Error: fail to update product`});
    });
    return result;
}

const deleteProduct = async ({product_id, product_shop}) => {
    const {deletedCount} = await products.deleteOne({
        product_shop: product_shop,
        _id: product_id,
    })
    .catch(error => {
        throw new ConflictErrorResponse({message: `Error: fail to delete product`});
    });

    return deletedCount;
}

const deleteClothes = async ({product_id, product_shop}) => {
    const {deletedCount} = await clothes.deleteOne({
        product_shop: product_shop,
        _id: product_id,
    })
    .catch(error => {
        throw new ConflictErrorResponse({message: `Error: fail to delete product`});
    });

    return deletedCount;
}

const deleteElectronics = async ({product_id, product_shop}) => {
    const {deletedCount} = await electronics.deleteOne({
        product_shop: product_shop,
        _id: product_id,
    })
    .catch(error => {
        throw new ConflictErrorResponse({message: `Error: fail to delete product`});
    });

    return deletedCount;
}

const deleteFurnitures = async ({product_id, product_shop}) => {
    const {deletedCount} = await furnitures.deleteOne({
        product_shop: product_shop,
        _id: product_id,
    })
    .catch(error => {
        throw new ConflictErrorResponse({message: `Error: fail to delete product`});
    });

    return deletedCount;
}

const countExistProducts = async (shop_id, product_ids) => {
    const result = await products.countDocuments({
        _id: {$in: product_ids},
        product_shop: shop_id
    });

    return result;
}

module.exports = { 
    findAllProductsWithQuery, 
    publishAProduct, 
    draftAProduct, 
    findProductByUser, 
    findAllProducts, 
    findProduct,
    updateProduct,
    updateClothes,
    updateElectronics,
    updateFurnitures,
    deleteProduct,
    deleteClothes,
    deleteElectronics,
    deleteFurnitures,
    countExistProducts
};