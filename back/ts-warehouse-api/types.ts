// AUTO-GENERATED by typescript-type-def

export type WarehouseEntryVariant=("Item"|"Container");
export type WarehouseEntry={"name":string;"parent_id":string;"variant":WarehouseEntryVariant;};
export type PathSegment={"id":string;"name":string;};
export type WarehouseEntryInsertedWithPath={"id":string;"entry":WarehouseEntry;"path":(PathSegment)[];};
export type IndexSuccessResponse={"list":(WarehouseEntryInsertedWithPath)[];};
export type GenericError={"error":string;};
export type GenericAuthedResponse<T,E>=(({"type":"Success";}&T)|({"type":"Error";}&E)|{"type":"UnauthorizedError";});
export type DeleteSuccessResponse={"removed":WarehouseEntry;};
export type CreateWarehouseEntry={"name":string;"parent_id":(string|null);};
export type WarehouseEntryInserted={"id":string;"entry":WarehouseEntry;};
export type CreateSuccessResponse={"entry_inserted":WarehouseEntryInserted;};
export type __AllTyps=[(string|null),(string|null),string,GenericAuthedResponse<IndexSuccessResponse,GenericError>,string,string,GenericAuthedResponse<DeleteSuccessResponse,GenericError>,CreateWarehouseEntry,string,GenericAuthedResponse<CreateSuccessResponse,GenericError>,string,WarehouseEntry,string,GenericAuthedResponse<CreateSuccessResponse,GenericError>,string,string,GenericAuthedResponse<WarehouseEntryInsertedWithPath,GenericError>];
