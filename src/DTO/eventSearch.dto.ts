import { IsOptional, IsString } from "class-validator"

export class eventSearchDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    location?: string

    @IsString()
    @IsOptional()
    category?: string

    @IsString()
    @IsOptional()
    date?: string

} 