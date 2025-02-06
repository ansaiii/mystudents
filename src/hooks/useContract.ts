import { useState, useCallback } from 'react'
import { Contract, CreateContractDTO } from '../types/contract'
import { contractService } from '../services/contract'

export function useContract() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取合同列表
  const getContracts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const contracts = await contractService.getContracts()
      return contracts
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // 创建合同
  const createContract = useCallback(async (data: CreateContractDTO) => {
    setLoading(true)
    setError(null)
    try {
      const newContract = await contractService.createContract(data)
      return newContract
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // 获取合同详情
  const getContractById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const contract = await contractService.getContractById(id)
      return contract
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getContracts,
    createContract,
    getContractById
  }
} 