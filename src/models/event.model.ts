// event.model.ts
export class Event {
    id: number = 202404131730;
    name: string = "";
    date: string = "";
    time: string = "";
    type: string = "";
    songs: Song[] = []
  }
  
  export class Song {
      gName: string = "";
      sId: number = 0;
      sName: string = "";
      alias: string = "";
      cId: number = 0;
      cName: string = "";
      lyrics: string[] = [];
      pdf: Pdf = new Pdf();
      medias: Media[] = [];
      authors: string[] = [];
      note: string = "";
      play: boolean = false;
    }
    
    export class Pdf {
      name: string = "";
      link: string = "";
      desc: string = "";
      lang: string = "";
    }
  
    export class Media {
      name: string = "";
      link: string = "";
      type: string = "";
      part: string = "";
    }