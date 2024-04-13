// src/files/files.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly dataDir: string;

  constructor() {
    // Set the data directory path in the constructor
    this.dataDir = path.join(__dirname, '../../uploads');
  }

  async getFiles(id: string): Promise<{ name: string, isFile: boolean }[]> {
    try {
      const dirPath = path.join(this.dataDir, `${id}`);

      const items = await fs.promises.readdir(dirPath);
      const itemsWithInfo = await Promise.all(items.map(async (item) => {
        const itemPath = path.join(this.dataDir || './', item);
        
        // to check if item is a folder or a file
        const itemStats = await fs.promises.stat(itemPath);

        return {
          name: item,
          isFile: itemStats.isFile()
        };
      }));

      return itemsWithInfo;
    
    } catch (error) {
      throw error;
    }
  }


  async uploadFile(file: Express.Multer.File, id: string): Promise<void> {
    try {
      const dirPath = path.join(this.dataDir, `${id}`);

      // skip id for now (will handlel in a seperate folder later)
      const filePath = path.join(this.dataDir, file.originalname);
      
      // write file to disk
      await fs.promises.writeFile(filePath, file.buffer);
    } catch (error) {
      throw error;
    }
  }
}

