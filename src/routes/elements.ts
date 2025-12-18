import { Router, Request, Response } from "express";
import { getDatabase } from "../config/database";
import { ObjectId } from "mongodb";
import * as SibApiV3Sdk from "@sendinblue/client";

const router = Router();

interface Element {
  id: number;
  title: string;
  num: number;
}
// Tworzymy instancję TransactionalEmailsApi
const brevoApi = new SibApiV3Sdk.TransactionalEmailsApi();

// Ustawiamy API Key
brevoApi.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);
// GET - pobierz wszystkie elementy
router.get("/elements", async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const collection = db.collection<Element>("day-free-elements");

    const elements = await collection.find({}).toArray();

    res.json({
      success: true,
      data: elements,
    });
  } catch (error) {
    console.error("Błąd pobierania elementów:", error);
    res.status(500).json({
      success: false,
      message: "Błąd serwera",
    });
  }
});

// DELETE - usuń element po _id
router.delete("/elements/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Sprawdź czy ID jest prawidłowe
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Nieprawidłowe ID",
      });
    }

    const db = getDatabase();
    const collection = db.collection("day-free-elements");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Element nie znaleziony",
      });
    }
    const sendSmtpEmail = {
      sender: {
        email: "wavetrace.music@gmail.com",
        name: "FREE-DAY",
      },
      to: [{ email: "jakub.rezler96@gmail.com", name: "FREE-DAY" }],
      subject: "OGARNIASZ DZISIAJ DZIEŃ",
      textContent: `DZISIAJ TY OGARNIASZ`,
    };
    await brevoApi.sendTransacEmail(sendSmtpEmail);
    res.json({
      success: true,
      message: "Element został usunięty",
      deletedId: id,
    });
  } catch (error) {
    console.error("Błąd usuwania elementu:", error);
    res.status(500).json({
      success: false,
      message: "Błąd serwera",
    });
  }
});

export default router;
