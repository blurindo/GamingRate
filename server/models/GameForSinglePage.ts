export class Game {
    id: number;
    imageId?: string;
    firstReleaseDate: number;
    genres: Genre[] | null;
    involvedCompanies: InvolvedCompany[] | null;
    name: string;
    platforms: Platform[] | null;
    storyline: string | null;

    constructor(data: any) {
        this.id = data.id;
        this.imageId = data.cover?.image_id ?? undefined;
        this.firstReleaseDate = data.first_release_date;
        this.genres = data.genres || null;
        this.involvedCompanies = data.involved_companies || null;
        this.name = data.name;
        this.platforms = data.platforms || null;
        this.storyline = data.storyline || null;
    }
}

class Genre {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

class InvolvedCompany {
    id: number;
    company: Company;
    publisher: boolean;

    constructor(id: number, company: Company, publisher: boolean) {
        this.id = id;
        this.company = company;
        this.publisher = publisher;
    }
}

class Company {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

class Platform {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}