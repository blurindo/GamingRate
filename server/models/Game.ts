// Exporting each interface individually
export interface GameDTO {
    id: number;
    cover: Cover;
    firstReleaseDate: number;
    name: string;
}

export interface Cover {
    id: number;
    imageId: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface InvolvedCompany {
    id: number;
    company: Company;
    publisher: boolean;
}

export interface Company {
    id: number;
    name: string;
}
