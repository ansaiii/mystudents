import Taro from '@tarojs/taro'
import { Contract, CreateContractDTO } from '../types/contract'

class ContractService {
  private readonly STORAGE_KEY = 'CONTRACTS'

  // 获取所有合同
  async getContracts(): Promise<Contract[]> {
    try {
      const { data } = await Taro.getStorage({ key: this.STORAGE_KEY })
      return data || []
    } catch (error) {
      console.error('获取合同列表失败:', error)
      return []
    }
  }

  // 获取单个合同
  async getContractById(id: string): Promise<Contract | null> {
    try {
      const contracts = await this.getContracts()
      return contracts.find(contract => contract.id === id) || null
    } catch (error) {
      console.error('获取合同详情失败:', error)
      return null
    }
  }

  // 创建合同
  async createContract(contractData: CreateContractDTO): Promise<Contract> {
    try {
      const contracts = await this.getContracts()
      const newContract: Contract = {
        id: `contract_${Date.now()}`,
        ...contractData,
        remainingHours: contractData.totalHours,
        totalAmount: contractData.totalHours * contractData.pricePerHour,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const updatedContracts = [...contracts, newContract]
      await Taro.setStorage({
        key: this.STORAGE_KEY,
        data: updatedContracts
      })

      return newContract
    } catch (error) {
      console.error('创建合同失败:', error)
      throw new Error('创建合同失败')
    }
  }

  // 更新合同
  async updateContract(id: string, updateData: Partial<Contract>): Promise<Contract> {
    try {
      const contracts = await this.getContracts()
      const index = contracts.findIndex(contract => contract.id === id)
      
      if (index === -1) {
        throw new Error('合同不存在')
      }

      const updatedContract = {
        ...contracts[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      }

      contracts[index] = updatedContract
      await Taro.setStorage({
        key: this.STORAGE_KEY,
        data: contracts
      })

      return updatedContract
    } catch (error) {
      console.error('更新合同失败:', error)
      throw new Error('更新合同失败')
    }
  }

  // 删除合同
  async deleteContract(id: string): Promise<boolean> {
    try {
      const contracts = await this.getContracts()
      const updatedContracts = contracts.filter(contract => contract.id !== id)
      
      await Taro.setStorage({
        key: this.STORAGE_KEY,
        data: updatedContracts
      })

      return true
    } catch (error) {
      console.error('删除合同失败:', error)
      throw new Error('删除合同失败')
    }
  }

  // 扣除课时
  async deductHours(id: string, hours: number): Promise<Contract> {
    try {
      const contract = await this.getContractById(id)
      if (!contract) {
        throw new Error('合同不存在')
      }

      if (contract.remainingHours < hours) {
        throw new Error('剩余课时不足')
      }

      return await this.updateContract(id, {
        remainingHours: contract.remainingHours - hours
      })
    } catch (error) {
      console.error('扣除课时失败:', error)
      throw new Error('扣除课时失败')
    }
  }
}

// 导出单例
export const contractService = new ContractService() 