import { IsString } from "class-validator"

export class createEventDto {
    @IsString()
    name: string

    @IsString()
    location: string

    @IsString()
    category: string

    @IsString()
    date: string

} 