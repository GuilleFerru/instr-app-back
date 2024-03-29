import { dateInLocalDate, formatDate, parseStringToDate } from '../../utils/formatDate.js';

export const changeIDForViewDTO = (data) => ({
    id: data._id,
    item: data.item,
    description: data.description,
    nonstockdate: data.nonstockdate,
    claimdate: data.claimdate,
    claimed: data.claimed,
    claimedBy: data.claimedBy,
    claimedQty: data.claimedQty,
    //addedToClaim: data.addedToClaim,
});

export const changeIDForViewItemsDTO = (data) => ({
    id: data._id,
    item: data.item,
    smallDescription: data.smallDescription,
    bigDescription: data.bigDescription,
    unit: data.unit,
    storeUbication: data.storeUbication,
    quantity: data.quantity,
});

export const saveStoreClaimDTO = (data) => ({
    item: data.item,
    description: data.description,
    nonstockdate: data.nonstockdate ? dateInLocalDate(data.nonstockdate) : null,
    claimdate: data.claimdate ? dateInLocalDate(data.claimdate) : null,
    claimed: data.claimed,
    claimedBy: data.claimedBy,
    claimedQty: data.claimedQty,
    //addedToClaim: data.addedToClaim,
    sector: 'Instrumentos-Sistemas'
});