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


export const changeIDForViewStoreWorkshopDTO = (data) => ({
    id: data._id,
    eqType: data.eqType,
    tag: data.tag,
    item: data.item,
    bigDescription: data.bigDescription,
    storeWorkshopUbication: data.storeWorkshopUbication,
    quantity: data.quantity,
    date: data.date,
});

export const saveStoreWorkshopDTO = (data) => ({
    eqType: data.eqType,
    tag: data.tag ? data.tag : '-',
    item: data.item ? data.item : '-',
    bigDescription: data.bigDescription ? data.bigDescription : 'Sin información relevante',
    storeWorkshopUbication: data.storeWorkshopUbication,
    quantity: data.quantity,
    date: data.date ? dateInLocalDate(data.date) : dateInLocalDate(new Date()),
    sector: 'Instrumentos-Sistemas'
});

export const reduceForLookUpDTO = (ubications) => ubications.map(ubication => ({
    id: ubication.id,
    name: ubication.name,
}));

export const saveUbicationWorkshopDTO  = (data) => {
    return {
        name: data.name,
    }
}