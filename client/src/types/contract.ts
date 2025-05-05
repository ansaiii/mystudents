export interface Contract {
  _id: string
  studentName: string
  phoneNumber: string
  startDate: string
  totalHours: number
  remainingHours: number
  pricePerHour: number
  totalAmount: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateContractDTO {
  studentName: string
  phoneNumber: string
  startDate: string
  totalHours: number
  remainingHours: number
  pricePerHour: number
} 