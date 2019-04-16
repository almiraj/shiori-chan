import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Plan } from '../entity/plan';

@Injectable()
export class ShareService {
  constructor(
    private afs: AngularFirestore
  ) {}

  addPlan(plan: Plan): Promise<void> {
    const shareId = localStorage.getItem('shareId');
    if (shareId) {
      return this.afs.collection('plans').doc(shareId).update({ data: JSON.stringify(plan) });
    }
    return this.afs.collection('plans').add({ data: JSON.stringify(plan) })
      .then(docRef => {
        localStorage.setItem('shareId', docRef.id);
        console.log(docRef);
      });
  }
}
