const db = require('../config/database');

const PackageService = {
    async getAllPackages() {
        try {
            const [rows] = await db.execute('SELECT * FROM Paket');
            return rows;
        } catch (error) {
            throw new Error(`Failed to fetch packages: ${error.message}`);
        }
    },
    async getPackageById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM Paket WHERE paket_id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Failed to fetch package: ${error.message}`);
        }
    },
    async createPackage(packageData) {
        const { nama_paket, harga, durasi, kualitas_video, jumlah_akun, fitur } = packageData;
        
        if (!nama_paket || !harga || !durasi) {
            throw new Error('Required fields (nama_paket, harga, durasi) are missing');
        }
        try {
            const [result] = await db.execute(
                `INSERT INTO Paket (nama_paket, harga, durasi, kualitas_video, jumlah_akun, fitur) VALUES (?, ?, ?, ?, ?, ?)`,
                [nama_paket, harga, durasi, kualitas_video, jumlah_akun, fitur]
            );
            return result.insertId;
        } catch (error) {
            throw new Error(`Failed to create package: ${error.message}`);
        }
    },
    async updatePackage(id, packageData) {
        const { nama_paket, harga, durasi, kualitas_video, jumlah_akun, fitur } = packageData;
        try {
            await db.execute(
                `UPDATE Paket SET nama_paket = ?, harga = ?, durasi = ?, kualitas_video = ?, jumlah_akun = ?, fitur = ? WHERE paket_id = ?`,
                [nama_paket, harga, durasi, kualitas_video, jumlah_akun, fitur, id]
            );
        } catch (error) {
            throw new Error(`Failed to update package: ${error.message}`);
        }
    },
    async deletePackage(id) {
        try {
            await db.execute('DELETE FROM Paket WHERE paket_id = ?', [id]);
        } catch (error) {
            throw new Error(`Failed to delete package: ${error.message}`);
        }
    }
};

module.exports = PackageService;