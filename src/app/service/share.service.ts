import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Plan } from '../entity/plan';

@Injectable()
export class ShareService {
  constructor(
    private afs: AngularFirestore
  ) {}

  sharePlan(plan: Plan): Promise<string> {
    const localStorageId = 'sharedId:' + plan.id;
    const sharedId = localStorage.getItem(localStorageId);
    if (sharedId) {
      return this.afs.collection('plans').doc(sharedId).update({ data: JSON.stringify(plan) })
        .then(() => sharedId);
    }
    return this.afs.collection('plans').add({ data: JSON.stringify(plan) })
      .then(docRef => {
        localStorage.setItem(localStorageId, docRef.id);
        return docRef.id;
      });
  }
}
