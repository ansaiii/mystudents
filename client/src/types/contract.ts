export interface Contract {
  id: string
  studentName: string
  startDate: string
  totalHours: number
  remainingHours: number
  pricePerHour: number
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export interface CreateContractDTO {
  studentName: string
  totalHours: number
  pricePerHour: number
  startDate: string
} 