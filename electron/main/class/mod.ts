import {ModVersion} from "./modVersion";

export class Mod {
    sid: string;
    name: string;
    author: string;
    github: string;
    githubLink: string;
    releases: any[];
    versions: ModVersion[];
    type: string;
    needPattern?: string;
    ignorePattern?: string;

    constructor(modId: string, name: string, author: string, github: string, githubLink: string, type: string, needPattern?: string, ignorePattern?: string) {
        this.sid = modId;
        this.name = name;
        this.author = author;
        this.github = github;
        this.githubLink = githubLink;
        this.releases = [];
        this.versions = [];
        this.type = type;
        this.needPattern = needPattern;
        this.ignorePattern = ignorePattern;
    }
}
